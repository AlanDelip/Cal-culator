import $ from "jquery";

const RECORD_TMPL = '<div class="diet-item">\n' +
    '                <img class="diet-img" src="#image"/>\n' +
    '                <div class="diet-detail">\n' +
    '                    <div>\n' +
    '                        <div class="detail-item">\n' +
    '                            <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQxLjMwMSA0MS4zMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQxLjMwMSA0MS4zMDE7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8cGF0aCBkPSJNMjAuNjQyLDBjNS42OTgsMCwxMC44NTcsMi4zMTcsMTQuNjAyLDYuMDQ3YzMuNzMsMy43NDYsNi4wNDcsOC45MDUsNi4wNDcsMTQuNjAzICBjMCw1LjY5OC0yLjMxNywxMC44NTctNi4wNDcsMTQuNjAzYy0zLjc0NiwzLjczLTguOTA0LDYuMDQ3LTE0LjYwMiw2LjA0N1M5Ljc4NiwzOC45ODMsNi4wNTYsMzUuMjUzICBDMi4zMSwzMS41MDcsMC4wMDgsMjYuMzQ5LDAuMDA4LDIwLjY1YzAtNS42OTgsMi4zMDEtMTAuODU3LDYuMDQ3LTE0LjYwM0M5Ljc4NiwyLjMxNywxNC45NDQsMCwyMC42NDIsMEwyMC42NDIsMHogTTMxLjE2NiwxOS41MjMgIGMwLjYxOSwwLDEuMTExLDAuNTA4LDEuMTExLDEuMTI3YzAsMC42MTktMC40OTIsMS4xMjctMS4xMTEsMS4xMjdIMjAuNjc0aC0wLjAzMmMtMC40MTMsMC0wLjc3OC0wLjIzOC0wLjk2OC0wLjU3MWwtMC4wMTYtMC4wMTYgIGwwLDBsLTAuMDE2LTAuMDMybDAsMHYtMC4wMTZsMCwwbC0wLjAxNi0wLjAzMmwwLDBsLTAuMDE2LTAuMDMybDAsMHYtMC4wMTZsMCwwbC0wLjAxNi0wLjAzMmwwLDBsLTAuMDE2LTAuMDE2bDAsMHYtMC4wMzJsMCwwICBsLTAuMDE2LTAuMDMybDAsMHYtMC4wMTZsMCwwbC0wLjAxNi0wLjAzMmwwLDB2LTAuMDMybDAsMHYtMC4wMTZ2LTAuMDE2bC0wLjAxNi0wLjAxNmwwLDB2LTAuMDMybDAsMHYtMC4wMzJsMCwwVjIwLjczbDAsMHYtMC4wMTYgIGwwLDB2LTAuMDMybDAsMFYyMC42NWwwLDBWNy4yMDZjMC0wLjYxOSwwLjQ5Mi0xLjExMSwxLjExMS0xLjExMWMwLjYxOSwwLDEuMTI3LDAuNDkyLDEuMTI3LDEuMTExdjEyLjMxN0gzMS4xNjZ6IE0zMy42NTcsNy42MzUgIGMtMy4zMzMtMy4zMzMtNy45MzYtNS4zODEtMTMuMDE1LTUuMzgxUzEwLjk2LDQuMzAxLDcuNjI3LDcuNjM1QzQuMzEsMTAuOTY4LDIuMjQ2LDE1LjU3MSwyLjI0NiwyMC42NSAgYzAsNS4wNzksMi4wNjMsOS42ODIsNS4zODEsMTMuMDE2YzMuMzMzLDMuMzMzLDcuOTM2LDUuMzgxLDEzLjAxNSw1LjM4MXM5LjY4Mi0yLjA0OCwxMy4wMTUtNS4zODEgIGMzLjMzMy0zLjMzMyw1LjM5Ny03LjkzNiw1LjM5Ny0xMy4wMTZDMzkuMDU0LDE1LjU3MSwzNi45OTEsMTAuOTY4LDMzLjY1Nyw3LjYzNUwzMy42NTcsNy42MzV6IiBmaWxsPSIjMDAwMDAwIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="/>\n' +
    '                            <div>#time</div>\n' +
    '                        </div>\n' +
    '                        <div class="detail-item">\n' +
    '                            <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00NjUuMDgzLDI5MC43M2wtMi4yNjItNDAuMzQ0bC0yNC42MjksMzIuMDMzYy0xLjk2MSwyLjU1LTYuMTM2LDcuMDYxLTExLjQ2NiwxMS4xNzIgICAgYzIuMTA2LTYuOTc4LDMuOTg2LTE0LjkzNiw1LjIyOS0yMy43MTRjNC4zMDItMzAuMzk4LDEuNjIzLTc3LjA1My0zNS41NTYtMTI2LjY5M2wtMTUuNi0yMC44MjhsLTEwLjIyMiwyMy45MzEgICAgYy0xMS43OTEsMjcuNjA0LTMwLjg2OSw0MS40NTMtNDguNiwzNS4yOGMtMTMuNjUtNC43NS0yNC43NDUtMjAuMzcyLTMwLjQzNy00Mi44NjNjLTUuMzA5LTIwLjk3OC04LjM5NS01Ny44OTMsNy4wNjUtMTE0LjYyOSAgICBMMzA1LjE2NSwwbC0yNC4zNDMsNS40ODRjLTgyLjExNSwxOC40OTgtMTM3LjQ0OCw3Ni44MTItMTYwLjAyLDE2OC42MzZjLTkuNDg4LDM4LjU5OS0xMS4yNzUsNzUuMTY4LTExLjAwOSw5OS45MDIgICAgYy0xOS40MDItMTUuNjg2LTI5LjA5MS0yOS40NDktMjkuMzQ1LTI5LjgxM2wtMTguNDgxLTI3LjE1MmwtOC40MTgsMzEuNzkyYy00LjYyNywxNy40NzQtNi45NzIsMzUuNTUxLTYuOTcyLDUzLjcyOSAgICBjMCwxMTQuNjEzLDkyLjU1LDIwNy45OTksMjA2LjgzOSwyMDkuMzljMC44NTksMC4wMjIsMS43MiwwLjAzMywyLjU4NCwwLjAzM2MwLjg2NCwwLDEuNzI1LTAuMDExLDIuNTg0LTAuMDMzICAgIGMxMTQuMjktMS4zOTEsMjA2LjgzOS05NC43NzcsMjA2LjgzOS0yMDkuMzlDNDY1LjQyMywyOTguNzQzLDQ2NS4zMDksMjk0Ljc1Niw0NjUuMDgzLDI5MC43M3ogTTI1Ni4wMDEsNDgxLjk3NSAgICBjLTM4LjczNiwwLTcwLjI0OS0zMS41MTMtNzAuMjQ5LTcwLjI0OGMwLTY3LjU5OCwzMS45NjctOTcuODgsNTYuODg1LTExMS4yMTdjLTMuMTc1LDE3LjE2Mi0wLjM2LDMzLjQyNCw0LjkyOSw0NS41MzIgICAgYzcuODgzLDE4LjA0NSwyMS45NDksMjkuODY1LDM3LjYyOCwzMS42MTdjNi4xNTksMC42ODYsMTYuNDY4LDAuMTU1LDI3LjI3NC03LjcwOGM4Ljg2NywxMi4wMDEsMTMuNzgxLDI2LjY0MSwxMy43ODEsNDEuNzc2ICAgIEMzMjYuMjQ5LDQ1MC40NjMsMjk0LjczNSw0ODEuOTc1LDI1Ni4wMDEsNDgxLjk3NXogTTM0NC42OTEsNDU4LjQ2NmM3LjM4OS0xMy45NjUsMTEuNTgzLTI5Ljg3MSwxMS41ODMtNDYuNzM5ICAgIGMwLTI4LjQyNy0xMi4xMzktNTUuNjMtMzMuMzAzLTc0LjYzMmwtMTIuMzEyLTExLjA1M2wtOS44MDgsMTMuMzI1Yy0yLjQ5NywzLjM5My03LjQyMyw5LjAxMS0xMi4zMiw4LjQ1NCAgICBjLTMuODg0LTAuNDM0LTkuNTQ5LTQuODY5LTEzLjQ0OS0xMy43OThjLTUuMzkzLTEyLjM0My02LjQ4Ny0zMS44NTcsNi42MDktNDkuNjAzbDIwLjc4Mi0yOC4xNjNsLTM0LjcyOCw0LjM1MiAgICBjLTEuMTcxLDAuMTQ3LTI4Ljk5NiwzLjgzMi01Ni41ODcsMjQuNTY5Yy00NS44MTEsMzQuNDMtNTUuNDI4LDg3LjgyMS01NS40MjgsMTI2LjU0OWMwLDE2Ljg3Miw0LjE5NSwzMi43ODEsMTEuNTg4LDQ2Ljc0OCAgICBjLTU0LjEzOC0zMC45MTktOTAuNzEyLTg5LjIxNS05MC43MTItMTU1Ljg5OGMwLTUuNjg4LDAuMjY4LTExLjM2MywwLjgtMTcuMDA0YzEwLjEyNSw5LjU5MywyMy44NTEsMjAuNzY2LDQxLjMyNiwzMS4xMzQgICAgbDI2LjA4NywxNS40NjdsLTMuNTE3LTMwLjEyOWMtMC4wNjgtMC41ODUtNi42NDQtNTkuMTgsOC44NDktMTIxLjUyQzE2Ny44NjYsMTA5LjIzNiwyMDUuOTYsNjIuNjU5LDI2My41NTUsNDEuNzMgICAgYy04LjAzMiwzOS42NjItOC40NTYsNzUuMzU2LTEuMTE5LDEwNC4zNDJjOC4yMTQsMzIuNDUyLDI2LjMyMSw1NS43MjYsNDkuNjc4LDYzLjg1MmMxNi4yMzcsNS42NDksMzMuNzM1LDMuNTQ5LDQ5LjI3OC01LjkxMiAgICBjOC45NDctNS40NDYsMTcuMDQxLTEzLjE5NywyMy45OTktMjIuOTAxYzE1LjAzMSwyNi44NDEsMjAuNzUsNTQuNzYsMTcuMDE1LDgzLjI1NmMtMy41MzMsMjYuOTU1LTE0LjYyNyw0NC41NjUtMTQuNzAyLDQ0LjY4MyAgICBsLTEyLjg0MywxOS43MDNsMjMuMjc5LDMuMzU0YzExLjcyLDEuNjg4LDIzLjk1OS0wLjg4OSwzNS45MTMtNy40ODdDNDI2Ljk5MywzODEuOTYsMzkyLjc2Niw0MzEuMDA2LDM0NC42OTEsNDU4LjQ2NnoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"/>\n' +
    '                            <div>#calorie KCal</div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="label #type">#type</div>\n' +
    '                </div>\n' +
    '            </div>';

$(() => {
    $.ajax({
        type: "GET",
        url: "https://kao7g8cibi.execute-api.us-east-1.amazonaws.com/alpha/get-recommendation",
        data: {
            username: localStorage.getItem("username")
        },
        crossDomain: true,
        contentType: 'application/json'
    }).done(res => {
        for (let item of res.records) {
            $('.item-panel').append(
                RECORD_TMPL.replace("#image", item.imageUrl)
                    .replace("#time",
                        new Date(item.datetime).toLocaleString(
                            "en-US",
                            {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            }))
                    .replace("#calorie", item.calories)
                    .replace(/#type/g, item.mealname)
            );
        }
        $('.record-content').show()
    });
});