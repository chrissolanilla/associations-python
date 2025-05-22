from scoring.module import ScoreModule
import json

from core.models import WidgetQset


class Associations(ScoreModule):
    def __init__(self, play_id, instance, play=None):
        super().__init__(play_id, instance, play)
        self.lives = 0
        self.seen_questions = set()
        self.seen_wrong_answers = {}
        self.scores = {}  # required by base class calculate_score

    def load_questions(self, timestamp=False):
        """Loads questions and optionally sets lives from options"""
        super().load_questions(timestamp)
        widget_qset = self.instance.get_latest_qset()

        if not widget_qset:
            print("No widget_qset found!")
            return

        try:
            decoded_data = WidgetQset.decode_data(widget_qset.data)

            if (
                decoded_data
                and isinstance(decoded_data, dict)
                and "options" in decoded_data
                and "lives" in decoded_data["options"]
            ):
                print(f"we in the if statement: {json.dumps(decoded_data, indent=2)}")
                self.lives = decoded_data["options"]["lives"]
            else:
                print("WE DONT HAVE LIVES IN OPTIONS")
                print("Decoded data:", decoded_data)

        except Exception as e:
            print(f"[ERROR] Failed to decode widget_qset data: {e}")

    def handle_log_question_answered(self, log):
        item_id = str(log.item_id) if hasattr(log, "item_id") else str(log["item_id"])


        # Skip if already seen this question
        if item_id in self.seen_questions:
            return

        self.seen_questions.add(item_id)
        score = self.check_answer(log)
        self.scores[item_id] = score  # for base calculate_score()

        if score == 100:
            print("our question is correct!")
            print(f"lives left: {self.lives}")
            self.total_questions += 1
            self.verified_score += 100
        else:
            print("our question is wrong!")
            if self.lives > 0:
                self.lives -= 1
                self.seen_wrong_answers[item_id] = (
                    log.text if hasattr(log, "text") else log["text"]
                )

                print(f"lives left: {self.lives}")
            else:
                self.total_questions += 1

    def check_answer(self, log):
        # item_id = str(getattr(log, "item_id", log["item_id"]))
        item_id = str(log.item_id) if hasattr(log, "item_id") else str(log["item_id"])

        if item_id not in self.questions:
            print(f"[Associations] Item ID '{item_id}' not in self.questions")
            return 0

        question = self.questions[item_id]
        try:
            user_answer = json.loads(log.text if hasattr(log, "text") else log["text"])
        except Exception:
            user_answer = []

        if not isinstance(user_answer, list):
            user_answer = [str(user_answer)]
        user_answer = [str(ans).strip() for ans in user_answer]

        for ans in question.get("answers", []):
            correct_answers = ans["text"] if isinstance(ans["text"], list) else [str(ans["text"])]
            correct_answers = [a.strip() for a in correct_answers]

            if self.contains_all(correct_answers, user_answer):
                return 100

        return 0

    def calculate_score(self):
        if self.lives > 0:
            self.calculated_percent = 100
        else:
            super().calculate_score()


    def contains_all(self, correct_list, user_list):
        return all(c in user_list for c in correct_list)

    def get_overview_items(self):
        items = []
        items.append({"message": "Points Lost", "value": 100 - self.calculated_percent})
        items.append({"message": "Final Score", "value": self.calculated_percent})
        return items

