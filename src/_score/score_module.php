<?php
namespace Materia;

class Score_Modules_Associations extends Score_Module
{
	private $lives = 0;

	public function handle_log_question_answered($log) {
		$this->verified_score += $this->check_answer($log);
	}

	public function check_answer($log){
		$questionID = $log->item_id;
		$userAnswer = json_decode($log->text, true); // Decode JSON string to array
		$seenAnswers = []; // Use an array to track seen questions
		$isCorrect = false;

		// Check if question exists
		if (isset($this->questions[$questionID])) {
			if (in_array($questionID, $seenAnswers)) {
				return 0;
			}

			// Add question ID to seen list
			$seenAnswers[] = $questionID;

			$question = $this->questions[$questionID];
			// Ensure userAnswer is treated as an array
			$userAnswerArray = array_map('trim', $userAnswer);

			foreach ($question->answers as $answer) {
				$correctAnswerArray = array_map('trim', $answer['text']); // Use the correct answer text as an array and trim whitespace
				if ($this->contains_all($correctAnswerArray, $userAnswerArray)) {
					// Exit after finding a correct answer
					$isCorrect = true;
					break;
				}
			}

			if ($isCorrect) {
				$this->total_questions++;
				return 100;
			}

			else if($this->lives > 0) {
				$this->lives--;
				$seen_wrong_answers[$questionID] = $userAnswer;
				return 0;
			}
			else if($this->lives <= 0) {
				$this->total_questions++;
				return 0;
			}
		}
		else {
			trace("SORRY Question ID: $questionID not found in questions array");
		}
  }

	protected function load_questions($timestamp = false)
	{
		if (empty($this->inst->qset->data)) {
			$this->inst->get_qset($this->inst->id, $timestamp);
		}

		if (!empty($this->inst->qset->data)) {
			$this->questions = Widget_Instance::find_questions($this->inst->qset->data);
		}

		if(isset($this->inst->qset->data['options']['lives'])) {
			$this->lives = $this->inst->qset->data['options']['lives'];
		}
	}

	private function contains_all($correctAnswerArray, $userAnswerArray)
	{
		foreach ($correctAnswerArray as $answer) {
			if (!in_array($answer, $userAnswerArray)) {
				return false;
			}
		}
		return true;
	}
}
?>

