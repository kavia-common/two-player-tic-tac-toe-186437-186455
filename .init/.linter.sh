#!/bin/bash
cd /home/kavia/workspace/code-generation/two-player-tic-tac-toe-186437-186455/frontend_tic_tac_toe
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

