var title_val, scale_val, symbol_val;
function setGraphTitle(title) {
    title_val = title;
}
function setGraphScale(scale) {
    scale_val = scale;
}
function setGraphSymbol(symbol) {
    symbol_val = symbol;
}
function drawBotGraph(state) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'history-graph',
            type: 'line',
            backgroundColor:'transparent',
            zoomType: 'x',
        },
        title: {
                text: 'Botnets',
                style: {
                    color: '#FFFFFF',
                    font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Time',
                style: {
                    color: '#FFFFFF',
                    font: 'bold 14px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
            }
        },
        yAxis: {
            title: {
                text: 'Number of Bots',
                style: {
                    color: '#FFFFFF',
                    font: 'bold 14px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
            }
        },
        tooltip: {
            enabled: true,
            formatter: function() {
                return '<strong>' + htmlEncode(this.series.name) + '</strong><br />' + htmlEncode(this.y) + ' bot(s)';
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: state,
    });
    return chart;
}

function drawMoneyGraph(state) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'history-graph',
            type: 'line',
            backgroundColor:'transparent',
            zoomType: 'x',
        },
        title: {
                text: title_val,
                style: {
                    color: '#FFFFFF',
                    font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Time',
                style: {
                    color: '#FFFFFF',
                    font: 'bold 14px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
            }
        },
        yAxis: {
            title: {
                text: scale_val,
                style: {
                    color: '#FFFFFF',
                    font: 'bold 14px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
            }
        },
        tooltip: {
            enabled: true,
            formatter: function() {
                return '<strong>' + htmlEncode(this.series.name) + '</strong><br /> ' + htmlEncode(symbol_val) + htmlEncode(this.y);
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: state,
    });
    return chart;
}



function drawFlagGraph(state) {

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'history-graph',
            type: 'line',
            backgroundColor:'transparent',
            zoomType: 'x',
        },
        title: {
                text: 'Captured Flags',
                style: {
                    color: '#FFFFFF',
                    font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Time',
                style: {
                    color: '#FFFFFF',
                    font: 'bold 14px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
            }
        },
        yAxis: {
            title: {
                text: 'Flags Captured',
                style: {
                    color: '#FFFFFF',
                    font: 'bold 14px "Trebuchet MS", Verdana, sans-serif',
                    'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
                },
            }
        },
        tooltip: {
            enabled: true,
            formatter: function() {
                return '<strong>' + htmlEncode(this.series.name) + '</strong><br />' + htmlEncode(this.y) + ' flag(s)';
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: state,
    });
    return chart;
}

function getSeriesIndexByName(state, teamName) {
    for(var index = 0; index < state.length; index++) {
        if (state[index].name == teamName) {
            return index;
        }
    }
    return undefined;
}

/* Updates the local graph state */
function updateFlagState(flagState, update) {
    timestamp = update['timestamp'] * 1000;
    for (var teamName in update['scoreboard']) {
        flagCount = update['scoreboard'][teamName]['flags'].length;
        seriesIndex = getSeriesIndexByName(flagState, teamName);
        if (seriesIndex !== undefined) {
            /* Add to existing series' data array */
            flagState[seriesIndex].data.push([timestamp, flagCount]);
        } else {
            //console.log("Create flag series: " + teamName);
            newSeries = {
                name: teamName,
                data: [
                    [timestamp, flagCount],
                ]
            }
            flagState.push(newSeries);
        }
    }
}

/* Called if the Flag graph is currently displayed */
function liveFlagUpdate(chart, update) {
    timestamp = update['timestamp'] * 1000;
    for (var teamName in update['scoreboard']) {
        //console.log("Updating: " + teamName);
        flagCount = update['scoreboard'][teamName]['flags'].length;
        index = getSeriesIndexByName(chart.series, teamName);
        if (index !== undefined) {
            var shift = (30 <= chart.series[index].data.length);
            var scores = [timestamp, flagCount];
            chart.series[index].addPoint(scores, true, shift);
        } else {
            create_series = {
                name: teamName,
                data: [
                    [timestamp, flagCount],
                ]
            }
            chart.addSeries(create_series);
        }
    }
}

function updateMoneyState(moneyState, update) {
    timestamp = update['timestamp'] * 1000;
    for (var teamName in update['scoreboard']) {
        money = update['scoreboard'][teamName]['money'];
        seriesIndex = getSeriesIndexByName(moneyState, teamName);
        if (seriesIndex !== undefined) {
            /* Add to existing series' data array */
            moneyState[seriesIndex].data.push([timestamp, money]);
        } else {
            //console.log("Create money series: " + teamName);
            newSeries = {
                name: teamName,
                data: [
                    [timestamp, money],
                ]
            }
            moneyState.push(newSeries);
        }
    }
}

function liveMoneyUpdate(chart, update) {
    timestamp = update['timestamp'] * 1000;
    for (var teamName in update['scoreboard']) {
        console.log("Updating: " + teamName);
        money = update['scoreboard'][teamName]['money'];
        index = getSeriesIndexByName(chart.series, teamName);
        if (index !== undefined) {
            var shift = (30 <= chart.series[index].data.length);
            var scores = [timestamp, money];
            chart.series[index].addPoint(scores, true, shift);
        } else {
            create_series = {
                name: teamName,
                data: [
                    [timestamp, money],
                ]
            }
            chart.addSeries(create_series);
        }
    }
}

function updateBotState(botState, update) {
    timestamp = update['timestamp'] * 1000;
    for (var teamName in update['scoreboard']) {
        bots = update['scoreboard'][teamName]['bots'];
        seriesIndex = getSeriesIndexByName(botState, teamName);
        if (seriesIndex !== undefined) {
            /* Add to existing series' data array */
            botState[seriesIndex].data.push([timestamp, bots]);
        } else {
            //console.log("Create bot series: " + teamName);
            newSeries = {
                name: teamName,
                data: [
                    [timestamp, bots],
                ]
            }
            botState.push(newSeries);
        }
    }
}

function liveBotUpdate(chart, update) {
    timestamp = update['timestamp'] * 1000;
    for (var teamName in update['scoreboard']) {
        console.log("Updating: " + teamName);
        bots = update['scoreboard'][teamName]['bots'];
        index = getSeriesIndexByName(chart.series, teamName);
        if (index !== undefined) {
            var shift = (30 <= chart.series[index].data.length);
            var scores = [timestamp, bots];
            chart.series[index].addPoint(scores, true, shift);
        } else {
            create_series = {
                name: teamName,
                data: [
                    [timestamp, bots],
                ]
            }
            chart.addSeries(create_series);
        }
    }
}

function initializeState(updater, state, updates) {
    for(index = 0; index < updates.length; ++index) {
        updater(state, updates[index]);
    }
}

function initializeSocket(length) {
    $("body").css("cursor", "progress");
    window.history_ws = new WebSocket(wsUrl() + "/scoreboard/wsocket/game_history?length=" + length);
    var chart = undefined;
    var flagState = []; // List of Highchart series
    var moneyState = [];
    var botState = [];
    var liveUpdateCallback = undefined;

    history_ws.onopen = function() {
        $("#activity-monitor").removeClass("fa-eye-slash");
        $("#activity-monitor").addClass("fa-refresh fa-spin");
    }

    history_ws.onclose = function() {
        $("#activity-monitor").removeClass("fa-refresh fa-spin");
        $("#activity-monitor").addClass("fa-eye-slash");
    }

    history_ws.onmessage = function (evt) {
        msg = jQuery.parseJSON(evt.data);
        //console.log(msg);
        if ('error' in msg) {
            console.log("ERROR: " + msg.toString());
        } else if ('history' in msg) {
            /* Default graph is flags, init that first */
            initializeState(updateFlagState, flagState, msg['history']);
            chart = drawFlagGraph(flagState);
            liveUpdateCallback = liveFlagUpdate;
            /* Init other states */
            initializeState(updateMoneyState, moneyState, msg['history']);
            initializeState(updateBotState, botState, msg['history']);
        } else if ('update' in msg) {
            /* Update graph states */
            updateFlagState(flagState, msg['update']);
            updateMoneyState(moneyState, msg['update']);
            updateBotState(botState, msg['update']);
            /* Update the live chart */
            liveUpdateCallback(chart, msg['update']);
        }
        $("body").css("cursor", "default");
    };
    $("#flags-history-button").off();
    $("#flags-history-button").click(function() {
        chart = drawFlagGraph(flagState);
        liveUpdateCallback = liveFlagUpdate;
    });
    $("#money-history-button").off();
    $("#money-history-button").click(function() {
        chart = drawMoneyGraph(moneyState);
        liveUpdateCallback = liveMoneyUpdate;
    });
    $("#bots-history-button").off();
    $("#bots-history-button").click(function() {
        chart = drawBotGraph(botState);
        liveUpdateCallback = liveBotUpdate;
    });
    
}

$(document).ready(function() {
    initializeSocket(29);
    $("#datapoints").change(function(){
        initializeSocket(this.value);
    });
});