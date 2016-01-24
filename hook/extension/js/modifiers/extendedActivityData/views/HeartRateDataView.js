var HeartRateDataView = AbstractDataView.extend(function(base) {

    return {

        heartRateData: null,

        mainColor: [255, 43, 66],

        init: function(heartRateData, units, userSettings) {

            this.setViewId('HeartRateDataView_i79a78d98s9a7g7');

            base.init.call(this);

            this.heartRateData = heartRateData;

            this.units = units;

            this.userSettings = userSettings;

            this.setupDistributionTable();

            this.tooltipTemplate = "<%if (label){";
            this.tooltipTemplate += "var hr = label.split(' ')[1].replace('%','').split('-');";
            this.tooltipTemplate += "var finalLabel = label + ' @ ' + Helper.heartrateFromHeartRateReserve(hr[0], stravistiX.userSettings_.userMaxHr, stravistiX.userSettings_.userRestHr) + '-' + Helper.heartrateFromHeartRateReserve(hr[1], stravistiX.userSettings_.userMaxHr, stravistiX.userSettings_.userRestHr) + 'bpm';";
            this.tooltipTemplate += "%><%=finalLabel%> during <%}%><%= Helper.secondsToHHMMSS(value * 60) %>";

        },

        setupDistributionTable: function() {

            var table = '';
            table += '<div>';
            table += '<div>';
            table += '<table class="distributionTable">';

            table += '<tr>'; // Zone
            table += '<td>ZONE</td>'; // Zone
            table += '<td>%HRR</td>'; // bpm
            table += '<td>BPM</td>'; // bpm
            table += '<td>TIME</td>'; // Time
            table += '<td>% ZONE</td>'; // % in zone
            table += '</tr>';

            var zoneId = 1;
            for (var zone in this.heartRateData.hrrZones) {
                table += '<tr>'; // Zone
                table += '<td>Z' + zoneId + '</td>'; // Zone
                table += '<td>' + this.heartRateData.hrrZones[zone].fromHrr + "% - " + this.heartRateData.hrrZones[zone].toHrr + "%" + '</th>'; // %HRR
                table += '<td>' + this.heartRateData.hrrZones[zone].fromHr + " - " + this.heartRateData.hrrZones[zone].toHr + '</td>'; // bpm%
                table += '<td>' + Helper.secondsToHHMMSS(this.heartRateData.hrrZones[zone].s) + '</td>'; // Time%
                table += '<td>' + this.heartRateData.hrrZones[zone].percentDistrib.toFixed(0) + '%</td>'; // % in zone
                table += '</tr>';
                zoneId++;
            }

            table += '</table>';
            table += '</div>';
            table += '</div>';
            this.table = $(table);

        },

        displayGraph: function() {

            var labelsData = [];
            for (var zone in this.heartRateData.hrrZones) {
                var label = "Z" + (parseInt(zone) + 1) + " " + this.heartRateData.hrrZones[zone].fromHrr + "-" + this.heartRateData.hrrZones[zone].toHrr + "%";
                labelsData.push(label);
            }


            var hrDistributionInMinutesArray = [];
            for (var zone in this.heartRateData.hrrZones) {
                hrDistributionInMinutesArray.push((this.heartRateData.hrrZones[zone].s / 60).toFixed(2));
            }

            this.graphData = {
                labels: labelsData,
                datasets: [{
                    label: "Heart Rate Reserve Distribution",
                    fillColor: "rgba(" + this.mainColor[0] + ", " + this.mainColor[1] + ", " + this.mainColor[2] + ", 0.5)",
                    strokeColor: "rgba(" + this.mainColor[0] + ", " + this.mainColor[1] + ", " + this.mainColor[2] + ", 0.8)",
                    highlightFill: "rgba(" + this.mainColor[0] + ", " + this.mainColor[1] + ", " + this.mainColor[2] + ", 0.75)",
                    highlightFill: "rgba(" + this.mainColor[0] + ", " + this.mainColor[1] + ", " + this.mainColor[2] + ", 1)",
                    data: hrDistributionInMinutesArray
                }]
            };

            // Graph it from Abstract
            base.displayGraph.call(this);
        },

        render: function() {

            base.render.call(this);

            // Add a title
            this.content += this.generateSectionTitle('<img src="' + this.appResources.heartBeatIcon + '" style="vertical-align: baseline; height:20px;"/> HEART RATE <a target="_blank" href="' + this.appResources.settingsLink + '#/healthSettings" style="float: right;margin-right: 10px;"><img src="' + this.appResources.cogIcon + '" style="vertical-align: baseline; height:20px;"/></a>');

            // Creates a grid
            this.makeGrid(3, 3); // (col, row)

            this.insertheartRateDataIntoGrid();
            this.generateCanvasForGraph();
            this.setupDistributionTable();

            if (!this.isAuthorOfViewedActivity) {
                this.content += '<u>Note:</u> You don\'t own this activity. Notice that <strong>TRaining IMPulse</strong>, <strong>%HRR Average</strong> and <strong>distribution graph</strong> are computed from your StravistiX health settings.<br/>';
                this.content += 'This allows you to analyse your heart capacity with the data recorded on the activity of this athlete.<br/><br/>';
            }

            // Push grid, graph and table to content view
            this.content += this.grid.html();
            this.content += this.graph.html();
            this.content += this.table.html();
        },

        insertheartRateDataIntoGrid: function() {

            // Insert some data inside grid
            this.insertContentAtGridPosition(0, 0, this.heartRateData.TRIMP.toFixed(0), 'TRaining IMPulse', '', 'displayAdvancedHrData');
            this.insertContentAtGridPosition(1, 0, this.heartRateData.averageHeartRate.toFixed(0), 'Average Heart Rate', 'bpm', 'displayAdvancedHrData'); // Usefull for running
            this.insertContentAtGridPosition(2, 0, this.heartRateData.activityHeartRateReserve.toFixed(0), 'Heart Rate Reserve Avg', '%', 'displayAdvancedHrData');

            // Quartiles
            this.insertContentAtGridPosition(0, 1, this.heartRateData.lowerQuartileHeartRate, '25% Quartile HeartRate', 'bpm', 'displayAdvancedHrData');
            this.insertContentAtGridPosition(1, 1, this.heartRateData.medianHeartRate, '50% Quartile HeartRate', 'bpm', 'displayAdvancedHrData');
            this.insertContentAtGridPosition(2, 1, this.heartRateData.upperQuartileHeartRate, '75% Quartile HeartRate', 'bpm', 'displayAdvancedHrData');

            // Other
            this.insertContentAtGridPosition(0, 2, this.heartRateData.TRIMPPerHour.toFixed(0), 'TRaining IMPulse / Hour', '', 'displayAdvancedHrData');
        }
    }
});
