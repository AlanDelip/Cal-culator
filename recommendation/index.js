import $ from "jquery";
import Chart from "chart.js";

$(() => {
    let ctx = document.getElementById('calorie-chart').getContext('2d');
    loadProfileFromLocal();
    loadRecommendation();

    function loadProfileFromLocal() {
        let username = localStorage.getItem("username");
        let gender = localStorage.getItem("gender");
        let weight = localStorage.getItem("weight");
        let height = localStorage.getItem("height");
        let year = localStorage.getItem("year");
        let month = localStorage.getItem("month");
        let day = localStorage.getItem("day");
        let exercise = localStorage.getItem("daysExercise");

        $('#username').text(username);
        $(`.avatar.${gender}`).show();
        let genderRadios = $('.radio-button[name=gender]');
        for (let radio of genderRadios) {
            let id = $(radio).attr("id");
            if (id === gender) {
                $(radio).attr("checked", "checked");
            } else {
                $(radio).attr("checked", null);
            }
        }
        genderRadios.change(e => {
            $(`.avatar.${gender}`).hide();
            $(`.avatar.${e.target.id}`).show();
            gender = e.target.id;
            localStorage.setItem("gender", gender);
        });

        $('#year').val(year);
        $('#month').val(month);
        $('#day').val(day);
        $('#exercise').val(exercise);
        $('#weight').val(weight);
        $('#height').val(height);
    }

    $('.update-btn').click(e => {
        let username = $('#username').text();
        let gender = $('.radio-button[name=gender]:checked').attr("id");
        let weight = $('#weight').val();
        let height = $('#height').val();
        let year = $('#year').val();
        let month = $('#month').val();
        let day = $('#day').val();
        let birthday = year + "/" + month + "/" + day;
        let daysExercise = $('#exercise').val();

        $.ajax({
            type: "POST",
            url: "https://kao7g8cibi.execute-api.us-east-1.amazonaws.com/alpha/user-info",
            data: JSON.stringify({
                username, gender, weight, height, daysExercise, birthday
            }),
            contentType: 'application/json'
        }).done(res => {
            localStorage.setItem("username", username);
            localStorage.setItem("gender", gender);
            localStorage.setItem("year", year);
            localStorage.setItem("month", month);
            localStorage.setItem("day", day);
            localStorage.setItem("daysExercise", daysExercise);
            localStorage.setItem("height", height);
            localStorage.setItem("weight", weight);
            location.reload();
        });
    });

    function loadRecommendation() {
        $.ajax({
            type: "GET",
            url: "https://kao7g8cibi.execute-api.us-east-1.amazonaws.com/alpha/get-recommendation",
            data: {
                username: localStorage.getItem("username")
            },
            crossDomain: true,
            contentType: 'application/json'
        }).done(res => {
            let calories = [];
            let labels = [];
            for (let item of res.records) {
                let datetime = new Date(item.datetime).toLocaleString(
                    "en-US",
                    {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    });
                let calorie = item.calories;
                let meal = item.mealname;
                let label = datetime + "-" + meal;
                labels.push(label);
                calories.push(calorie.replace(/,/g, ""));
            }

            let averageCalorie = calories.reduce((a, b) => parseInt(a) + parseInt(b), 0) / calories.length;
            let baseCalories = [];
            let aveCalories = [];
            let base = parseInt(res.baseCalories / 3);
            let ave = parseInt(averageCalorie);
            for (let i = 0; i < calories.length; i++) {
                baseCalories.push(base);
                aveCalories.push(ave);
            }

            let $recLabel = $('.recommendation-label');
            let $recText = $('.recommendation-text');
            if (Math.abs(base - ave) / base <= 0.1) {
                $recLabel.text("=").addClass("maintain");
                $recText.text("Good Job! You're doing well in maintaining your weight.")
            } else {
                if (base > ave) {
                    $recLabel.text("⬇").addClass("lose");
                    $recText.text("You're losing weight recently. If you're on a diet, good job then! If not, try to ingest more calories.");
                } else {
                    $recLabel.text("⬆").addClass("up");
                    $recText.text("You're gaining weight recently. Remember to do more exercise to keep fit!");
                }
            }

            let calorieChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "calories",
                            data: calories,
                            barThickness: 40,
                            backgroundColor: "#e4bd1c",
                            order: 3
                        },
                        {
                            label: 'Base Calories',
                            data: baseCalories,
                            pointRadius: 0,
                            borderColor: "#0dc995",
                            type: 'line',
                            fill: false,
                            borderDash: [5, 5],
                            order: 2
                        },
                        {
                            label: 'Average Calories',
                            data: aveCalories,
                            pointRadius: 0,
                            borderColor: "#c93c4f",
                            type: 'line',
                            fill: false,
                            borderDash: [5, 5],
                            order: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        xAxes: [{
                            display: false,
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Calories"
                            }
                        }]
                    }
                }
            });
        });
    }
});