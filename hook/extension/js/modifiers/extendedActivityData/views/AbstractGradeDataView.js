var AbstractGradeDataView = AbstractDataView.extend(function(base) {

    return {

        gradeData: null,

        mainColor: [0, 128, 0],

        init: function(gradeData, units) {
            
            base.init.call(this);

            this.units = units;

            this.gradeData = gradeData;

            this.setupDistributionGraph(this.gradeData.gradeZones);

            this.setupDistributionTable(this.gradeData.gradeZones);

            this.speedUnitsData = this.getSpeedUnitData();

        },

        render: function() {

            base.render.call(this);

            // Add a title
            this.content += this.generateSectionTitle('<img src="' + this.appResources.areaChartIcon + '" style="vertical-align: baseline; height:20px;"/> GRADE <a target="_blank" href="' + this.appResources.settingsLink + '#/zonesSettings?selectZoneValue=grade" style="float: right;margin-right: 10px;"><img src="' + this.appResources.cogIcon + '" style="vertical-align: baseline; height:20px;"/></a>');

            // Creates a grid
            this.makeGrid(3, 5); // (col, row)

            this.insertGradeDataIntoGrid();
            this.generateCanvasForGraph();

            // Push grid, graph and table to content view
            this.content += this.grid.html();
            this.content += this.graph.html();
            this.content += this.table.html();
        },

        insertGradeDataIntoGrid: function() {

            this.insertContentAtGridPosition(0, 0, this.gradeData.gradeProfile, 'Grade Profile', '', 'displayAdvancedGradeData');

            this.insertContentAtGridPosition(0, 1, this.gradeData.lowerQuartileGrade, '25% Quartile Grade', '%', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(1, 1, this.gradeData.medianGrade, '50% Quartile Grade', '%', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(2, 1, this.gradeData.upperQuartileGrade, '75% Quartile Grade', '%', 'displayAdvancedGradeData');

            this.insertContentAtGridPosition(0, 2, (this.gradeData.upFlatDownInSeconds.up / this.gradeData.upFlatDownInSeconds.total * 100).toFixed(1), '% climbing', '%', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(1, 2, (this.gradeData.upFlatDownInSeconds.flat / this.gradeData.upFlatDownInSeconds.total * 100).toFixed(1), '% flat', '%', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(2, 2, (this.gradeData.upFlatDownInSeconds.down / this.gradeData.upFlatDownInSeconds.total * 100).toFixed(1), '% downhill ', '%', 'displayAdvancedGradeData');

            this.insertContentAtGridPosition(0, 3, Helper.secondsToHHMMSS(this.gradeData.upFlatDownInSeconds.up), 'Time climbing', '', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(1, 3, Helper.secondsToHHMMSS(this.gradeData.upFlatDownInSeconds.flat), 'Time flat', '', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(2, 3, Helper.secondsToHHMMSS(this.gradeData.upFlatDownInSeconds.down), 'Time downhill', '', 'displayAdvancedGradeData');

        }
    }
});
