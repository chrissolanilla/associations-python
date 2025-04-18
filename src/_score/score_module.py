from scoring.module import ScoreModule

import json

class ScoreModulesAssociations(ScoreModule):
    """
    A ScoreModule subclass for the 'Connections' or 'Associations' type of widget.
    It handles 'lives' for wrong answers, and only increments total_questions for
    correct answers or if the user runs out of lives.
    """

    def __init__(self, play_id, instance, play=None):
        super().__init__(play_id, instance, play)
        self.lives = 0
        # Track whether we've already processed a question
        self.seen_questions = set()
        # (Optional) track wrong answers for debugging or display if you like
        self.seen_wrong_answers = {}

    def load_questions(self, timestamp=False):
        """Loads questions and also fetches the 'lives' option if present."""
        # Always call parent so it loads self.questions, etc.
        super().load_questions(timestamp)

        # If the qset has an 'options' dict with 'lives', store it
        if (
            self.instance.qset.data
            and "options" in self.instance.qset.data
            and "lives" in self.instance.qset.data["options"]
        ):
            self.lives = self.instance.qset.data["options"]["lives"]

    def handle_log_question_answered(self, log):
        """
        Override the parent's handling so we can:
          1) Avoid automatically incrementing self.total_questions;
          2) Check if we've already scored this question;
          3) Decrement lives on wrong attempts if we have any left.
        """

        question_id = log.item_id if hasattr(log, "item_id") else log["item_id"]

        # If we've already processed this question, ignore further logs for it
        if question_id in self.seen_questions:
            return

        # Mark this question as 'seen' so we don't score it more than once
        self.seen_questions.add(question_id)

        # Evaluate the answer
        score = self.check_answer(log)

        # If the answer is correct:
        #   add 100 points, increment total_questions
        # Else if the answer is wrong:
        #   if we still have a life left, decrement lives, do not increment total_questions
        #   if we have no lives left, increment total_questions (finalizing that question’s attempt)
        if score == 100:
            # correct answer
            self.total_questions += 1
            self.verified_score += 100
        else:
            # wrong answer
            if self.lives > 0:
                # Use a life
                self.lives -= 1
                # Log or store the wrong answer if you like:
                self.seen_wrong_answers[question_id] = (
                    log.text if hasattr(log, "text") else log["text"]
                )
            else:
                # No more lives => question is "done" for them
                self.total_questions += 1

    def check_answer(self, log):
        """
        Decodes the user's submitted answer (JSON → array), then checks if
        there is at least one 'correct answers' array that is fully contained
        within the user's array. If so, return 100; else return 0.
        """
        question_id = log.item_id if hasattr(log, "item_id") else log["item_id"]
        # If question not found, do no scoring
        if question_id not in self.questions:
            print(f"Question ID: {question_id} not found in questions array!")
            return 0

        # Convert the text to an array. If it fails, userAnswer will be empty.
        try:
            user_answer = json.loads(log.text if hasattr(log, "text") else log["text"])
        except Exception:
            user_answer = []

        # Make sure user_answer is a list of strings, then strip spaces
        if not isinstance(user_answer, list):
            user_answer = [str(user_answer)]
        user_answer = [str(ans).strip() for ans in user_answer]

        question = self.questions[question_id]

        # question["answers"] is presumably a list of possible correct answers;
        # each "answer" might be something like { "text": [ "apple", "banana" ] }
        # We consider it correct if user_answer contains *all* items of at least
        # one of these "answer['text']" arrays.
        is_correct = False
        for ans in question["answers"]:
            # Convert the correct answer text to array, trimming spaces
            correct_answer_list = []
            if isinstance(ans["text"], list):
                correct_answer_list = [a.strip() for a in ans["text"]]
            else:
                # If text is not a list, treat it as a single string
                correct_answer_list = [str(ans["text"]).strip()]

            # Check if user_answer contains all required items
            if self.contains_all(correct_answer_list, user_answer):
                is_correct = True
                break

        return 100 if is_correct else 0

    def contains_all(self, correct_answer_list, user_answer_list) -> bool:
        """
        Returns True if every element of correct_answer_list is found in user_answer_list.
        """
        for c in correct_answer_list:
            if c not in user_answer_list:
                return False
        return True

