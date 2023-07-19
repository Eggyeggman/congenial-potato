let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
   $.ajex({
    url:`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lon}%2C${coordinates.source_lat}%3B${coordinates.destination_lon}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
    type:"get",
    sucsess:function(response){
        let images = {
            "turn_right":"ar_right.png",
            "turn_left":"ar_left.png",
            "slight_left":"ar_slight_left.png",
            "slight_right":"ar_slight_right.png",
            "straight":"ar_straight.png"
        }
        let steps = response.routes[0].legs[0].steps
        for (var i = 0; i<steps.length;i++){
            let images;
            let distance = steps[i].distance
            let instruction = steps[i].maneuver.instruction
            if (instruction.includes("Turn Right")){
                images = "turn_right"                 
            }
            if (instruction.includes("Turn Left")){
                images = "turn_left"                 
            }
            if (i>0) {
                $('#scene_container').append(`
                <a-entity gps-entity-place = "latitude:${steps[i].maneuver.location[1]};longitude:${steps[i].maneuver.location[0]};">
                <a-image
                name = "${instruction}"
                src = "./assets/ar.start.png"
                look-at="#step_${i - 1}"
                scale ="5 5 5"
                id = "step_{i}"
                position = "0 0 0"
                ></a-image>
                <a-entity>
                <a-text
                height = "60"
                value = "${instruction} ${distance}"
                ></a-text>
                </a-entity>
                </a-entity>
                `)
            }
            else{
                $('#scene_container').append(`
                <a-entity gps-entity-place = "latitude:${steps[i].maneuver.location[1]};longitude:${steps[i].maneuver.location[0]};">
                <a-image
                name = "${instruction}"
                src = "./assets/ar.start.png"
                look-at="#step_${i + 1}"
                scale ="5 5 5"
                id = "step_{i}"
                position = "0 0 0"
                ></a-image>
                <a-entity>
                <a-text
                height = "60"
                value = "${instruction} ${distance}"
                ></a-text>
                </a-entity>
                </a-entity>
                `)
            }
        }
    }
   })
}
