# Player Guide

## Overview

Connections is a widget that tasks the player with selecting a group of word from a grid.
The player aims to find connections between the words that all have some sort of relationship which
is then revealed by the description of the group of words. The description is revealed when the
player groups words that belong to the same group.

## Details

![Connections Player](assets/player_guide_1.png 'Connections Player')

1. Words Grid.
2. Tab Focused word.
3. Check selection button.
4. Life count and wrong attempts counter.
5. Help button.

Depending on the size of the grid, the player is informed in the beginning to select words in groups of X Y times.
The dimensions of the grid being X and Y are set by the creator. Usually, the player will
have lives/attempts equal to the maximum number of X or Y, however the creator can adjust this.

![Connections Player](assets/player_guide_2.png 'Connections Player')

Students are informed immedietely when they check a selection of words if it is right or wrong via a toast notification.
The game is also screen reader accessible and they will be audibly notified when they are right or wrong.

![Connections Player](assets/player_guide_3.png 'Connections Player')

If a student's selection is close but only one of their words is not like the others, then they will be notified that they are one word away.

![Connections Player](assets/player_guide_4.png 'Connections Player')

When a player makes a correct selection and they press the check selection button, the grid will
change and they will be able to see description of the group. If the creator has opted into showing
feedback for wrong answers in the scorescreen and the player runs out of lives before finishing the
game, the game will also display the remaining correct answers.

![End Screen](assets/player_guide_5.png 'End Screen')

The player is able to drag the pop up modal around to see the words and descriptions behind the modal.
They will be shown their correct selections, wrong attempts, and their overall grade. They will then be
prompted to go to the scorescreen to see their possible selections and potentially the correct answer if
the creator has opted into showing feedback for wrong answers.
