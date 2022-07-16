import unittest
import sys
import os

fileDir = os.path.dirname(os.path.abspath(__file__))  # Directory of the Module
parentDir = os.path.dirname(fileDir)  # Parent Directory
sys.path.append(parentDir)  # Add path into PYTHONPATH

from game import CluelessGame, ROOMS, WEAPONS, CHARACTERS
from player import Player


class TestGameBoard(unittest.TestCase):

    def test_create_player(self):
        """
        Test a player can be created
        """
        player = 'Kaushik'
        character = 'professor_plum'

        target = CluelessGame()
        result = target.create_player(player, character)

        self.assertEqual(result.player_name, 'Kaushik')
        self.assertIn(result.character_name, CHARACTERS)
        self.assertEqual(result.room_hall, 'study-library')

    def test_prepare_case_file(self):
        """
        Test Case File creation. Verify character, room and weapon cards are selected
        """
        target = CluelessGame()
        result = target.create_game_answer()

        self.assertNotIn(result[0], CHARACTERS)
        self.assertNotIn(result[1], ROOMS)
        self.assertNotIn(result[2], WEAPONS)

    def test_distribute_cards(self):
        """
        Test card distribution to players.
        """
        target = CluelessGame()

        #1 Create Player-1 and assign a character
        player1 = 'Kaushik'
        character1 = 'professor_plum'
        result1 = target.create_player(player1, character1)

        #2 Create Player-2 and assign a character
        player2 = 'Ethan'
        character2 = 'mrs_white'

        result2 = target.create_player(player2, character2)

        #3 Create Player-3 and assign a character
        player3 = 'Jake'
        character3 = 'mrs_peacock'

        result3 = target.create_player(player3, character3)

        #self.assertIn(result1.character_name, CHARACTERS)
        # Players card count must be zero before card distribution
        self.assertEqual(len(result1.cards), 0)

        # distribute cards
        result_dist = target.distribute_cards()

        # each player must cards > 0
        self.assertGreater(len(result1.cards), 0)
        self.assertGreater(len(result2.cards), 0)
        self.assertGreater(len(result3.cards), 0)

    def test_player_move(self):
        """
        Test player movement.
        """
        target_game = CluelessGame()

        #Create Player and assign a character
        player = 'Kaushik'
        character = 'professor_plum'
        room_hall = 'study'

        result_game = target_game.create_player(player, character)

        #move player and verify the destination room
        move_to_hallroom = 'lounge'
        target_player = Player(player, character, room_hall)
        target_player.move(move_to_hallroom)

        self.assertEqual(target_player.room_hall, move_to_hallroom)


if __name__ == '__main__':
    unittest.main()
