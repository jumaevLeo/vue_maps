import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyArpnY4x6nfA15RrSoqqu5DmU-VX066WeA',
        libraries: 'places',
    },
})

new Vue({
    render: h => h(App),
}).$mount('#app')