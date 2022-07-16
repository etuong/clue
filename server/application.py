from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import game
import os

# Action	HTTP Verb   Description
# Create	POST	    Create a new, unique thing
# Read	    GET	        Read the information about a thing or collection of things
# Update	PUT	        Update the information about an existing thing
# Delete	DELETE	    Delete a thing

# EB looks for an 'application' callable by default.
application = Flask(__name__, static_url_path="")
api = Api(application)
CORS(application)

game = game.CluelessGame()


class PlayerApi(Resource):
    # Get the player information base on the player's name
    def get(self, player_name):
        player = game.players.get(player_name)
        print(player.character_name)
        location = player.room_hall

        if player.allow_move:

            # If the new location is a hall
            if location in game.hallways.keys() and location is not None:

                # Every hall needs to be a tuple of two rooms
                player.available_moves = location.split('-')

            # If the new location is a room
            elif game.rooms.get(location) is not None:
                for hall in game.rooms.get(location).hallways:
                    if game.hallways.get(hall):
                        player.available_moves.append(hall)

                if game.rooms.get(location).secret_passage_connection:
                    player.available_moves.append(
                        game.rooms.get(location).secret_passage_connection)

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
    # Return information of all the players
    def get(self):
        response = dict()
        for name, player in game.players.items():
            response[name] = vars(player)
        response['current_player'] = game.current_player
        return response


class PlayerMoveApi(Resource):
    # Return the player's current location
    def get(self, player_name):
        player = game.players.get(player_name)
        return dict(available_moves=player.available_moves)

    # Update the player's location
    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('location', type=str)
        args = parser.parse_args()

        # Can't move if it's not your turn
        if game.current_player != player_name:
            return jsonify(error="It is not your turn to make a move")
        if game.player_moved:
            return jsonify(error="Player moves are not allowed right now")

        player = game.players.get(player_name)

        if player.room_hall in game.hallways.keys():
            game.hallways[player.room_hall] = True

        new_location = args.get('location')

        # If the new location is a hall
        if new_location in game.hallways.keys():
            game.hallways[new_location] = False

            # Player can't make suggestion, proceed with the next player's turn
            current_player = game.players.get(game.current_player)
            current_player.available_moves.clear()
            game.current_player = current_player.next_player

            # If the new current player has already made accusation, then skip and grab the next player
            if current_player.made_accusation:
                game.current_player = current_player.next_player
            game.players.get(game.current_player).allow_move = True
        # If the new location is a room
        else:
            # Reassign the player's next available moves
            player.available_moves.clear()

            # Allow the player to make suggestions
            player.allow_suggestion = True
            #game.player_moved = True

        player.move(new_location)
        player.allow_move = False

        return jsonify(location=new_location,
                       current_player_info=vars(
                           game.players.get(game.current_player)))


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

        guessed_answer = (args.accused_character, args.accused_room,
                          args.accused_weapon)
        print(guessed_answer)
        print(game.game_answer)

        if guessed_answer == game.game_answer:
            return jsonify(guess=True, current_player=game.current_player)
        else:
            game.current_player = game.players.get(
                game.current_player).next_player

            return jsonify(guess=False,
                           current_player_info=vars(
                               game.players.get(game.current_player)))


class SuggestionsApi(Resource):

    def get(self, player_name):
        return jsonify(game.game_answer)

    def put(self, player_name):
        parser = reqparse.RequestParser()
        parser.add_argument('suggested_character')
        parser.add_argument('suggested_weapon')
        parser.add_argument('suggested_room')
        args = parser.parse_args()

        suggested_character = args.suggested_character.lower()
        suggested_weapon = args.suggested_weapon.lower()
        suggested_room = args.suggested_room.lower()

        if game.current_player != player_name:
            return jsonify(error="It is not your turn to make a suggestion")

        if game.players.get(player_name).room_hall != suggested_room:
            return jsonify(error="You must be in the room of your suggestion")

        if game.suggesting_player is not None:
            return jsonify(error="Someone else is already making a suggestion")

        if not game.players.get(game.current_player).allow_suggestion:
            return jsonify(error="You cannot make a suggestion right now")

        for player in game.players.values():
            if player.character_name == suggested_character and player.player_name != player_name:
                if player.room_hall in game.hallways.keys():
                    game.hallways[player.room_hall] = True

                player.move(suggested_room)
                player.available_moves.clear()

                if not player.made_accusation:
                    player.allow_suggestion = True
            if player.player_name != player_name:
                player.allow_disapproval = True

        guessed_answer = (suggested_character, suggested_room,
                          suggested_weapon)

        # Keep a reference of the suggesting player
        game.suggesting_player = game.current_player

        # Turn off this flag so current player can't make any more suggestion on this round
        game.players.get(game.current_player).allow_suggestion = False

        # Get the next player and allow him to disapprove
        game.current_player = game.players.get(game.current_player).next_player

        return jsonify(
            current_player_info=vars(game.players.get(game.current_player)))


class DisproveSuggestionApi(Resource):

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('card')
        args = parser.parse_args()

        # current_player here is an object, not a string
        current_player = game.players.get(game.current_player)
        current_player.allow_disapproval = False

        # If player does not have the cards to disapprove, then proceed to the next player
        if args.card == "empty":
            game.current_player = current_player.next_player
        else:
            if not game.players.get(game.suggesting_player).allow_move:
                game.current_player = game.players.get(
                    game.suggesting_player).next_player

                if current_player.made_accusation:
                    game.current_player = current_player.next_player

                game.suggesting_player = None
                game.players.get(game.current_player).allow_move = True
                #game.player_moved = False

                for player in game.players.values():
                    player.allow_disapproval = False
            else:
                game.current_player = game.suggesting_player
                game.suggesting_player = None

        return jsonify(
            current_player_info=vars(game.players.get(game.current_player)))


class StartApi(Resource):

    def post(self):
        # When game begins playing, distribute cards to the players
        game.set_player_order()
        game.distribute_cards()

        response = dict()

        for name, player in game.players.items():
            response[name] = vars(player)

        response['current_player'] = game.current_player
        return response

    def get(self):
        # Return game state
        return {'isPlaying': game.game_started}


class ResetGameApi(Resource):

    def post(self):
        game.reset()
        return jsonify(reset=True)


api.add_resource(PlayerApi, '/api/player/<player_name>')
api.add_resource(PlayersApi, '/api/players')
api.add_resource(PlayerMoveApi, '/api/player/move/<player_name>')
api.add_resource(AccusationsApi, '/api/player/accusation/<player_name>')
api.add_resource(SuggestionsApi, '/api/player/suggestions/<player_name>')
api.add_resource(StartApi, '/api/start')
api.add_resource(DisproveSuggestionApi, '/api/player/disprove')
api.add_resource(ResetGameApi, '/api/reset')

if __name__ == "__main__":
    application.debug = True
    application.run(host='0.0.0.0',
                    port=os.environ.get('PORT', 8080),
                    debug=True)
