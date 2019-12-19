import $ from 'jquery';
import {CountUp} from 'countup.js';

const API_KEY = "qSM7jVMzTa5mOeucW1cotqYUboS6pEW1VhTZIzy8";
let apiClient = apigClientFactory.newClient({
    apiKey: API_KEY
});
const food_inventory = {
    "banana": 89,
    "apple": 52,
    "sandwich": 243,
    "orange": 47,
    "broccoli": 34,
    "carrot": 41,
    "hot dog": 290,
    "pizza": 266,
    "donut": 452,
    "cake": 371
};
const CALORIE_TMPL = '<div class="calorie-item">\n' +
    '                        <div class="delete-item">×</div>\n' +
    '                        <div class="calorie-detail">\n' +
    '                            <div>#name</div>\n' +
    '                            <div class="h-calorie"><span>#calorie</span> calories / 100 gram</div>\n' +
    '                        </div>\n' +
    '                        <div class="calorie-num-detail">\n' +
    '                            <input class="calorie-input" value="100" type="number"/>\n' +
    '                            <div>grams&nbsp;=&nbsp;</div>\n' +
    '                            <div class="calorie-item-total-num"><span id="#id">#calorie</span>&nbsp;Cal</div>\n' +
    '                        </div>\n' +
    '                    </div>';
$(() => {
    let imageKey;
    let countUpMap = {};
    let totalCountUp;
    $('.file-upload-input').change(function () {
        let input = this;
        if (input.files && input.files[0]) {
            $('#loading-cover').css("display", "flex").fadeIn(500);
            let reader = new FileReader();
            let uploader = new FileReader();
            reader.onload = function (e) {
                $('.image-upload-wrap').hide();
                $('.file-upload-image').attr('src', e.target.result);
                $('.file-upload-content').show();
                $('.file-upload-name').val(input.files[0].name);
            };
            reader.readAsDataURL(input.files[0]);

            uploader.onloadend = function (e) {
                let extension = input.files[0].name.split("\.")[1];
                let key = "calculator-" + new Date().getTime() + "." + extension;
                imageKey = key;
                let params = {
                    folder: "calculator-recognition",
                    item: key,
                    "Content-Type": "image/" + extension
                };
                apiClient.uploadFolderItemPut(params, uploader.result)
                    .then(res => {
                        $.ajax({
                            type: "POST",
                            url: "https://si26q1hg10.execute-api.us-east-1.amazonaws.com/alpha",
                            data: JSON.stringify({
                                key: key
                            }),
                            crossDomain: true,
                            contentType: 'application/json'
                        }).done(res => {
                            let canvas = document.getElementById("recognition-canvas");
                            let $uploadImg = $('.file-upload-image');
                            let currWidth = $uploadImg.width();
                            let currHeight = $uploadImg.height();
                            let originalWidth = $uploadImg[0].naturalWidth;
                            let originalHeight = $uploadImg[0].naturalHeight;
                            let scale = currWidth / originalWidth;
                            $(canvas).attr('width', currWidth).attr('height', currHeight);
                            let ctx = canvas.getContext("2d");
                            let visited = [];
                            for (let item of res) {
                                ctx.beginPath();
                                ctx.rect(item.left * scale, item.top * scale, (item.right - item.left) * scale, (item.bottom - item.top) * scale);
                                ctx.stroke();

                                if (!visited.includes(item.id)) {
                                    $('.calorie-list').append(
                                        CALORIE_TMPL.replace("#name", item.id)
                                            .replace("#id", new Date().getTime() + parseInt(Math.random() * 100))
                                            .replace(/#calorie/g, food_inventory[item.id]));
                                    visited.push(item.id);
                                }
                            }

                            let calorieList = $('.calorie-item-total-num').children('span');
                            for (let calorieItem of calorieList) {
                                let $calorieItem = $(calorieItem);
                                let id = $calorieItem.attr("id");
                                let gGram = parseInt($calorieItem.parents().siblings(".calorie-detail").children(".h-calorie").children("span").text());
                                let countUp = new CountUp(id, gGram, {duration: 1});
                                countUpMap[id] = countUp;
                                countUp.start();
                            }
                            updateTotalCalorie(true);

                            $('.calorie-input').change(e => {
                                let gram = parseInt(e.target.value);
                                let $currentEle = $(e.target);
                                let id = $currentEle.siblings(".calorie-item-total-num").children("span").attr("id");
                                let gGram = parseInt($currentEle.parents().siblings(".calorie-detail").children(".h-calorie").children("span").text());
                                countUpMap[id].update(gram / 100 * gGram);
                                setTimeout(() => updateTotalCalorie(), 1000);
                            });

                            $('.delete-item').click(e => {
                                let parent = $(e.target).parents(".calorie-item");
                                let countupId = $(e.target).siblings(".calorie-num-detail").children(".calorie-item-total-num").children("span")[0].id;
                                delete countUpMap[countupId];
                                parent.fadeOut(300, () => parent.remove());
                                updateTotalCalorie();
                            });

                            $('#loading-cover').fadeOut(500);
                        });
                    })
                    .catch(e => {
                        console.log(e);
                        alert("upload fail!");
                    });
            };

            uploader.readAsArrayBuffer(input.files[0]);
        }
    });

    function updateTotalCalorie(init) {
        let totalCal = 0;
        for (let key in countUpMap) {
            totalCal += countUpMap[key].endVal;
        }
        if (init) {
            totalCountUp = new CountUp("total-calorie", totalCal, {duration: 1});
            totalCountUp.start();
        } else {
            totalCountUp.update(totalCal);
        }
    }

    $('.add-record-btn').click(e => {
        $('#loading-cover').css("display", "flex").fadeIn(500);
        $.ajax({
            type: "POST",
            url: "https://kao7g8cibi.execute-api.us-east-1.amazonaws.com/alpha/diet-info",
            data: JSON.stringify({
                username: localStorage.getItem("username"),
                mealname: $('input[name=meal]:checked').attr("id"),
                calories: $('#total-calorie').text(),
                imageKey
            }),
            crossDomain: true,
            contentType: 'application/json'
        }).done(res => {
            console.log(res);
            $('#loading-cover').hide();
            location.href = "/record/index.html";
        });
    });
});