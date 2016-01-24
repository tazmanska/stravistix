/**
 *   ActivitiesExportModifier is responsible of ...
 */
function ActivitiesExportModifier() {
}

/**
 * Define prototype
 */
ActivitiesExportModifier.prototype = {

    modify: function modify() {
        
        var $container = $("<span style='float: right;' id='export-controls'><span>Export as  </span><span style='display: none' class='ajax-loading-image export-activities-spinner'></span><span>"),
            $form = $("form.search");
            
        $form.find("div.inline-inputs").append($container);
        
        $container.append("<a class='button btn-sm button-export-activities' id='export-as-json'>JSON</a>");
        
        $("#export-as-json").click(function(e) {
            e.preventDefault();
            getData().done(function(data) {
                saveAs(formatAsJson(data), "Activities.json");
            });
        });
        
        var formatAsJson = function(data) {
            return new Blob([JSON.stringify(data)], {type : 'application/json'});
        };
        
        var getData = function() {
            var requests = [],
                activities = [],
                deffered = $.Deferred(),
                i,
                j,
                max,
                url = "/athlete/training_activities?" + $form.serialize() + "&new_activity_only=false&per_page=100000&page=";
            $(".button-export-activities").hide();
            $(".export-activities-spinner").show();
            requests.push($.ajax({
                url: url + "1",
                success: function(data) {
                    for (i = 2, max = Math.ceil(data.total / data.perPage); i <= max; i++) {
                        requests.push($.ajax(url + i));
                    }
                    $.when.apply(self, requests).done(function() {
                        for (i in requests) {
                            var request = requests[i];
                            if (request.responseJSON.models) {
                                for (j = 0, max = request.responseJSON.models.length; j < max; j++) {
                                    var activity = request.responseJSON.models[j];
                                    activities.push({
                                        "id": activity.id,
                                        "url": activity.activity_url,
                                        "type": activity.activity_type_display_name,
                                        "calories": activity.calories ? Math.floor(activity.calories) : null,
                                        "commute": activity.commute,
                                        "description": activity.description,
                                        "distance": activity.distance,
                                        "elapsed_time": activity.elapsed_time,
                                        "elevation_gain": activity.elevation_gain,
                                        "moving_time": activity.moving_time,
                                        "name": activity.name,
                                        "private": activity.private,
                                        "start_time": activity.start_time,
                                        "suffer_score": activity.suffer_score,
                                        "trainer": activity.trainer
                                    });
                                }
                            }
                        }
                        deffered.resolve(activities);
                        $(".export-activities-spinner").hide();
                        $(".button-export-activities").show();
                    });
                }
            }));
            return deffered.promise();
        };
    }
};
