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
    def get(self, player_name):
        player = game.players.get(player_name)
        player_info = dict(name=player.player_name, character_name=player.character_name,
                            room_hall=player.room_hall, cards=player.cards)
        return player_info

    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('character_name', type=str)
        args = parser.parse_args()
        player = game.create_player(player_name, args.get('character_name'))
        game.hallways[player.room_hall] = False


class PlayersApi(Resource):
    def get(self):
        response = dict()

        for name, player in game.players.items():
            response[name] = vars(player)
        return response


class PlayerMoveApi(Resource):    
    def get(self, player_name):
        player = game.players.get(player_name)
        return dict(location=player.room_hall)

    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('location', type=str)
        args = parser.parse_args()

        current_player = [*game.players.keys()][game.current_player_index]
        if current_player != player_name:
            return jsonify(error="It is not your turn to make a move")

        player = game.players.get(player_name)
        current_location = player.room_hall
        new_location = args.get('location')

        acceptable_locations = None

        if current_location in game.hallways.keys():
            acceptable_locations = current_location.split('-')
        else:
            acceptable_locations = game.rooms.get(current_location).hallways
            secret_passage = game.rooms.get(current_location).secret_passage_connection
            if secret_passage:
                acceptable_locations.append(secret_passage)

        print(acceptable_locations)

        move_accepted = False

        if new_location in acceptable_locations:
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
            if current_location in game.hallways.keys():
                game.hallways[current_location] = True
                game.current_player_index += 1
                if game.current_player_index > len(game.players):
                    game.current_player_index = 0
            return dict(location=new_location)
        else:
            return dict(error="Unacceptable Location Selected")


class AccusationsApi(Resource):
    def get(self, player_name):
        return jsonify(game.game_answer)

    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('accused_character')
        parser.add_argument('accused_weapon')
        parser.add_argument('accused_room')
        args = parser.parse_args()

        current_player = [*game.players.keys()][game.current_player_index]
        if current_player != player_name:
            return jsonify(error="It is not your turn to make an accusation")

        guessed_answer = (args.accused_character, args.accused_room, args.accused_weapon)

        if guessed_answer == game.game_answer:
            return {'guess': True}
        else:
            game.current_player_index += 1
            if game.current_player_index > len(game.players):
                game.current_player_index = 0
            return {'guess': False}


class SuggestionsApi(Resource):
    def get(self, player_name):
        return jsonify(game.game_answer)

    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('suggested_character')
        parser.add_argument('suggested_weapon')
        parser.add_argument('suggested_room')
        args = parser.parse_args()

        current_player = [*game.players.keys()][game.current_player_index]
        if current_player != player_name:
            return jsonify(error="It is not your turn to make a suggestion")

        if game.players.get(player_name).room_hall != args.accused_room:
            return jsonify(error="You must be in the room of your suggestion")

        for player in game.players.values():
            if player.character_name == args.accused_character:
                player.move(args.accused_room)

        guessed_answer = (args.accused_character, args.accused_room, args.accused_weapon)
        #TODO Players take turns disproving suggestions
        game.current_player_index += 1
        if game.current_player_index > len(game.players):
            game.current_player_index = 0


class StartApi(Resource):
    def post(self):
        # When game begins playing, distribute cards to the players
        game.distribute_cards()


api.add_resource(PlayerApi, '/api/player/<player_name>')
api.add_resource(PlayersApi, '/api/players')
api.add_resource(PlayerMoveApi, '/api/player/move/<player_name>')
api.add_resource(AccusationsApi, '/api/player/accusation/<player_name>')
api.add_resource(SuggestionsApi, '/api/player/suggestions/<player_name>')
api.add_resource(StartApi, '/api/start')

if __name__ == "__main__":
    application.debug = True
    application.run(host='0.0.0.0', port=os.environ.get('PORT', 8080), debug=True)
