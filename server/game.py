import numpy as np
import random
from player import Player
from room import Room
from collections import OrderedDict

# Indicates whether hallway is free
HALLWAY_STATE = {
    'study-hall': True,
    'study-library': True,
    'hall-lounge': True,
    'hall-billiard': True,
    'lounge-dining': True,
    'library-billiard': True,
    'library-conservatory': True,
    'billiard-dining': True,
    'billiard-ballroom': True,
    'dining-kitchen': True,
    'conservatory-ballroom': True,
    'ballroom-kitchen': True
}

INITIAL_PLAYER_LOCATIONS = {
    'miss_scarlet': 'hall-lounge',
    'professor_plum': 'study-library',
    'colonel_mustard': 'lounge-dining',
    'mrs_peacock': 'library-conservatory',
    'mr_green': 'conservatory-ballroom',
    'mrs_white': 'ballroom-kitchen'
}

ROOMS = [
    'study', 'hall', 'billiard', 'lounge', 'dining', 'library', 'conservatory',
    'ballroom', 'kitchen'
]

WEAPONS = ['pipe', 'knife', 'wrench', 'rope', 'revolver', 'candlestick']

CHARACTERS = [
    'miss_scarlet', 'professor_plum', 'colonel_mustard', 'mrs_peacock',
    'mr_green', 'mrs_white'
]


class CluelessGame:

    def __init__(self):
        # Initialize the rooms
        self.rooms = dict()
        self.rooms['study'] = Room('study', 'kitchen',
                                   ['study-library', 'study-hall'])
        self.rooms['hall'] = Room(
            'hall', None, ['hall-billiard', 'hall-lounge', 'study-hall'])
        self.rooms['lounge'] = Room('lounge', 'conservatory',
                                    ['lounge-dining', 'hall-lounge'])
        self.rooms['library'] = Room(
            'library', None,
            ['study-library', 'library-conservatory', 'library-billiard'])
        self.rooms['billiard'] = Room('billiard', None, [
            'hall-billiard', 'billiard-ballroom', 'library-billiard',
            'billiard-dining'
        ])
        self.rooms['dining'] = Room(
            'dining', None,
            ['lounge-dining', 'dining-kitchen', 'billiard-diningroom'])
        self.rooms['conservatory'] = Room(
            'conservatory', 'lounge',
            ['library-conservatory', 'conservatory-ballroom'])
        self.rooms['ballroom'] = Room(
            'ballroom', None,
            ['billiard-ballroom', 'conservatory-ballroom', 'ballroom-kitchen'])
        self.rooms['kitchen'] = Room('kitchen', 'study',
                                     ['dining-kitchen', 'ballroom-kitchen'])

        self.hallways = HALLWAY_STATE.copy()

        # Player dictionary -> key: player name, value: player properties
        # Using an ordered dict to preserve ordering of player registration
        self.players = OrderedDict()

        self.game_answer = self.create_game_answer()
        print(self.game_answer)
        self.current_player = None
        self.suggesting_player = None
        self.game_started = False
        self.player_moved = False

    # Randomly create the mystery case
    def create_game_answer(self):
        character = random.choice(CHARACTERS)
        room = random.choice(ROOMS)
        weapon = random.choice(WEAPONS)

        WEAPONS.remove(weapon)
        CHARACTERS.remove(character)
        ROOMS.remove(room)

        return (character, room, weapon)

    # Create a new player and assign an initial starting position on the board
    def create_player(self, player_name, character_name):
        new_player = Player(player_name, character_name, None)

        new_player.available_moves.append(
            INITIAL_PLAYER_LOCATIONS.get(character_name))

        self.players[player_name] = new_player

        return new_player

    # Algorithm to distribute random cards to the players
    def distribute_cards(self):
        # Get all the cards
        cards = ROOMS.copy() + WEAPONS.copy() + CHARACTERS.copy()

        while len(cards) != 0:
            # Get a random card and remove from deck
            random_card = random.choice(cards)
            cards.remove(random_card)

            # Append new card to player hand
            self.players.get(self.current_player).cards.append(random_card)

            # Move on to the next player
            self.current_player = self.players.get(
                self.current_player).next_player

        self.current_player = [*self.players.keys()][0]
        self.game_started = True

    # Loop through the player list and set the play order
    def set_player_order(self):
        for player_index, player_object in enumerate(self.players.values()):
            if player_index + 1 < len(self.players.values()):
                player_object.next_player = [*self.players.keys()
                                             ][player_index + 1]
            else:
                player_object.next_player = [*self.players.keys()][0]

        # The current player is the first registered player
        self.current_player = [*self.players.keys()][0]
        [*self.players.values()][0].allow_move = True

        return

    # Call to reset for a new game
    def reset(self):
        CHARACTERS.append(self.game_answer[0])
        ROOMS.append(self.game_answer[1])
        WEAPONS.append(self.game_answer[2])

        self.players = OrderedDict()
        self.game_answer = self.create_game_answer()
        self.current_player = None
        self.suggesting_player = None
        self.game_started = False
        self.player_moved = False

        return
