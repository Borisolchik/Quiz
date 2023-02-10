import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHTTP} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {
    constructor() {
        this.quiz = null;
        this.questionBlock = null;
        this.currentQuestionIndex = 0;
        this.routeParams = UrlManager.getQueryParams();
        this.init();
        const that = this;

        document.getElementById('result-prev').onclick = function () {
            that.resultPrev(this);
        }
    }

    resultPrev() {
        location.href = '#/result?id=' + this.routeParams.id;
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHTTP.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('user').innerText = userInfo.fullName + ', ' + userInfo.email;
                    this.quiz = result;
                    this.answersQuiz();
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = '#/';
    }

    answersQuiz () {
        const testName = document.getElementById('test-name');
        testName.innerText = this.quiz.test.name;

        // let i = 1;
        this.questionBlock = document.getElementById('answers-question');
        this.quiz.test.questions.forEach(question => {

            const titleQuestion = document.createElement('div');
            this.currentQuestionIndex = this.currentQuestionIndex + 1;
            titleQuestion.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex + ':</span> ' + question.question;
            titleQuestion.className = 'answers-question-title question-title';
            titleQuestion.setAttribute('id','title');
            this.questionBlock.appendChild(titleQuestion);
            // i = i + 1;

            question.answers.forEach(answer => {
                const answerId = answer.id;

                const optionElement = document.createElement('div');
                optionElement.className = 'answers-question-option option';

                const inputId = 'answer-' + answer.id;
                const inputElement = document.createElement('input');
                inputElement.className = 'option-answer';
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('value', answer.id);
                inputElement.setAttribute('disabled', 'disabled');

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;
                if (answer.correct) {
                    labelElement.className = 'correct';
                    inputElement.setAttribute('checked', 'checked');
                    inputElement.className = 'answer-correct';
                }
                if (answer.correct === false) {
                    labelElement.className = 'wrong';
                    inputElement.setAttribute('checked', 'checked');
                    inputElement.className = 'answer-wrong';
                }

                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);
                this.questionBlock.appendChild(optionElement);
            })
        })

    }

}