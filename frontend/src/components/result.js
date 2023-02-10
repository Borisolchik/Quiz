import {UrlManager} from "../utils/url-manager.js";
import {CustomHTTP} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {
    constructor() {
        const that = this;
        this.routeParams = UrlManager.getQueryParams();
        this.init();
        document.getElementById('answers-all').onclick = function () {
            that.allAnswers(this);
        }
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHTTP.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = '#/';
    }

    allAnswers() {
        location.href = '#/answers?id=' + this.routeParams.id;
    }
}