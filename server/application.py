from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import game
import os

# EB looks for an 'application' callable by default.
application = Flask(__name__, static_url_path = "")
api = Api(application)
CORS(application)

game = game.CluelessGame()

class PlayerApi(Resource):
    # Get the player information base on the player's name
    def get(self, player_name):
        player = game.players.get(player_name)
        return vars(player)

    # Create a new player and return its info
    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('character_name', type=str)
        args = parser.parse_args()
        player = game.create_player(player_name, args.get('character_name'))
        game.hallways[player.room_hall] = False
        return vars(player)


class PlayersApi(Resource):
    def get(self):
        response = dict()
        for name, player in game.players.items():
            response[name] = vars(player)
        return response


class PlayerMoveApi(Resource):    
    def get(self, player_name):
        player = game.players.get(player_name)
        return dict(available_moves=player.available_moves)

    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('location', type=str)
        args = parser.parse_args()

        if game.current_player != player_name:
            return jsonify(error="It is not your turn to make a move")

        if game.player_moved:
            return jsonify(error="Player moves are not allowed right now")

        player = game.players.get(player_name)
        current_location = player.room_hall
        new_location = args.get('location')

        move_accepted = False

        if new_location in player.available_moves:
            if game.hallways.get(new_location):
                player.move(new_location)
                move_accepted = True
            elif new_location in game.rooms.keys():
                player.move(new_location)
                move_accepted = True
            else:
                move_accepted = False
        else:
            move_accepted = False

        if move_accepted:
            if new_location in game.hallways.keys():
                game.hallways[new_location] = True
                player.available_moves = new_location.split('-')
                game.current_player = game.players.get(game.current_player).next_player
            else:
                player.available_moves = game.rooms.get(new_location).hallways
                player.allow_suggestion = True
                secret_passage = game.rooms.get(new_location).secret_passage_connection
                if secret_passage:
                    player.available_moves.append(secret_passage)
                game.player_moved = True

            return jsonify(location=new_location, current_player=game.current_player)
        else:
            return jsonify(error="Unacceptable Location Selected")


class AccusationsApi(Resource):
    def get(self, player_name):
        return jsonify(game.game_answer)

    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('accused_character')
        parser.add_argument('accused_weapon')
        parser.add_argument('accused_room')
        args = parser.parse_args()

        if game.current_player != player_name:
            return jsonify(error="It is not your turn to make an accusation")

        game.players.get(game.current_player).made_accusation = True

        guessed_answer = (args.accused_character, args.accused_room, args.accused_weapon)

        if guessed_answer == game.game_answer:
            return jsonify(guess=True, current_player=game.current_player)
        else:
            game.current_player = game.players.get(game.current_player).next_player

            return jsonify(guess=False, current_player=game.current_player)


class SuggestionsApi(Resource):
    def get(self, player_name):
        return jsonify(game.game_answer)

    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('suggested_character')
        parser.add_argument('suggested_weapon')
        parser.add_argument('suggested_room')
        args = parser.parse_args()

        if game.current_player != player_name:
            return jsonify(error="It is not your turn to make a suggestion")

        if game.players.get(player_name).room_hall != args.suggested_room:
            return jsonify(error="You must be in the room of your suggestion")

        if game.suggesting_player is not None:
            return jsonify(error="Someone else is already making a suggestion")

        if not game.players.get(game.current_player).allow_suggestion:
            return jsonify(error="You cannot make a suggestion right now")

        for player in game.players.values():
            if player.character_name == args.suggested_character and player.player_name != player_name:
                player.move(args.suggested_room)
                player.allow_suggestion = True

        guessed_answer = (args.suggested_character, args.suggested_room, args.suggested_weapon)

        game.suggesting_player = game.current_player

        game.players.get(game.current_player).allow_suggestion = False
        
        game.current_player = game.players.get(game.current_player).next_player

        return jsonify(current_player=game.current_player)


class DisproveSuggestionApi(Resource):
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('card')

        args = parser.parse_args()

        if args.card is None:
            game.current_player = game.players.get(game.current_player).next_player
        else:
            game.current_player = game.players.get(game.suggesting_player).next_player
            game.suggesting_player = None
            game.player_moved = False


        return jsonify(current_player = game.current_player)


class StartApi(Resource):
    def post(self):
        # When game begins playing, distribute cards to the players
        game.distribute_cards()
        game.set_player_order()

        response = dict()

        for name, player in game.players.items():
            response[name] = vars(player)

        response['current_player'] = game.current_player
        return response
    
    def get(self):
        # Return game state
        return {'isPlaying': game.game_started}

api.add_resource(PlayerApi, '/api/player/<player_name>')
api.add_resource(PlayersApi, '/api/players')
api.add_resource(PlayerMoveApi, '/api/player/move/<player_name>')
api.add_resource(AccusationsApi, '/api/player/accusation/<player_name>')
api.add_resource(SuggestionsApi, '/api/player/suggestions/<player_name>')
api.add_resource(StartApi, '/api/start')
api.add_resource(DisproveSuggestionApi, '/api/player/disprove')

if __name__ == "__main__":
    application.debug = True
    application.run(host='0.0.0.0', port=os.environ.get('PORT', 8080), debug=True)
