import numpy as np


class Room:

    def __init__(self, name, secret_passage_connection, hallways):
        # Name of the room
        self.name = name

        # Kitchen <-> Study and Conservatory <-> Lounge rooms
        self.secret_passage_connection = secret_passage_connection

        # Hallways adjacent to the room
        self.hallways = hallways

    # Function that returns a list of available move options
    def get_move_options(self):
        # Get the adj moveable hallways
        move_options = [*self.hallways]

        # Append addition secret connection for kitchen, study, conservatory, and lounge rooms
        if self.secret_passage_connection:
            move_options.append(self.secret_passage_connection)

        return move_options
