<template>
  <div>
    <GmapMap
      :center="center"
      :editable="true"
      :zoom="13"
      map-type-id="terrain"
      style="width: 100%; height: 100vh;"
    >
      <GmapPolyline 
        :path="paths_under_forty"
        :options="options_under_forty"
      />
      <GmapPolyline 
        :path="paths_under_seventy"
        :options="options_under_seventy"
      />
      <GmapPolyline 
        :path="paths_above_seventy"
        :options="options_above_seventy"
      />
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      />
    </GmapMap>
  </div>
</template>

<script>
const home = { lat:41.294683, lng:69.274657 }
export default {
  name: 'GoogleMap',
  data() {
    return {
      connection:null,
      markers:[],
      center:home,
      paths_under_forty:[],
      options_under_forty:{
        strokeOpacity: 0.8,
				strokeWeight: 2,
				strokeColor: 'blue',
				fillColor: 'transparent',
				fillOpacity: 0.4
      },
      paths_under_seventy:[],
      options_under_seventy:{
        strokeOpacity: 0.8,
				strokeWeight: 2,
				strokeColor: 'green',
				fillColor: 'transparent',
				fillOpacity: 0.4
      },
      paths_above_seventy:[],
      options_above_seventy:{
        strokeOpacity: 0.8,
				strokeWeight: 2,
				strokeColor: 'red',
				fillColor: 'transparent',
				fillOpacity: 0.4
      },
    }
  },
  methods: {
    sendMessage() {
      let today = new Date()
      let lastDay = new Date()
      let time = today.getHours() + ":" + today.getMinutes();
      let currentDate = today.toJSON().slice(0, 10)+' '+time;
      lastDay.setDate(lastDay.getDate() - 3);
      let lastDate = lastDay.toJSON().slice(0, 10)+' '+time;
      // console.log(currentDate,lastDate);
      let message =  {
                        "action": "ws.admin.object_history",
                        "data": {
                          "start_time": lastDate,
                          "end_time": currentDate,
                          "object_id": 4430
                        }
                      }
      // this.connection.send(message);
      setInterval(() => {
        this.connection.send(JSON.stringify(message));
      }, 5000);
    }
  },
  mounted () {
    this.sendMessage();
  },
  created: function() {
    this.connection = new WebSocket("wss://gps.uzal.uz:8443/ws/tracking/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYwNjY2MjQ0LCJpYXQiOjE2NjAwNjE0NDQsImp0aSI6ImRlNTRmODI5YThkMzRkOWRiYzZkMDUxMDI0ZWUxZGRjIiwidXNlcl9pZCI6MTk4MSwicm9sZSI6Mn0.mJODVAC1pjx_QfSHKslE7p8oLaNPQmSBZsyuJ15lguc")

    this.connection.onopen = function(event) {
      console.log(event)
    }

    this.connection.onmessage = (event)=> {
      this.paths_under_forty = []
      this.paths_under_seventy = []
      this.paths_above_seventy = []
      this.markers = []
      // console.log(JSON.parse(event.data))
      let arr = JSON.parse(event.data).data
      if(arr) {
        this.center={lat:Number(arr[0].latitude),lng:Number(arr[0].longitude)}
        for(let q=0;q<arr.length;q++) {
          if(Number(arr[q].speed)>=0 && Number(arr[q].speed)<40) {
            this.paths_under_forty.push({lat:Number(arr[q].latitude),lng:Number(arr[q].longitude)})
          }else if(Number(arr[q].speed)>=40 && Number(arr[q].speed)<70) {
            this.paths_under_seventy.push({lat:Number(arr[q].latitude),lng:Number(arr[q].longitude)})
          }else {
            this.paths_above_seventy.push({lat:Number(arr[q].latitude),lng:Number(arr[q].longitude)})
          }
          if(q+1==arr.length) {
            this.markers.push({position:{lat:Number(arr[0].latitude),lng:Number(arr[0].longitude)}})
            this.markers.push({position:{lat:Number(arr[q].latitude),lng:Number(arr[q].longitude)}})
          }
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
