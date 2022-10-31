<template>
  <div class="d-flex">
    <div class="d-flex justify-center flex-wrap col-4" style="border: 1px solid white;">
      <span class="col-12 text-center text-h4 font-weight-black">Küfür engel</span>
      <v-btn :style="{ 'border-color': (kufurEngelOpen ? 'green' : 'red') }" elevation="24" @click="changeKufurEngel" outlined>{{(kufurEngelOpen ? 'ACIK' : 'KAPALI')}}</v-btn>
      <span class="col-12 text-center text-h6 mt-2">Hariç</span>
      <div class="col-12 d-flex">
        <v-select @change="kufurEngelCloseChannel" class="col-12" :items="channels.filter(c => !kufurEngelClosedChannels.map(a => a.id).includes(c.id))" item-text="name" item-value="id" v-model="kufurEngelChannel" filled label="Bir kanalı hariç tutmak icin sec"></v-select>
      </div>
      <div class="col-12 d-flex flex-wrap">
        <div v-for="chn in kufurEngelClosedChannels" class="col-12">
          <v-hover v-slot="{ hover }">
            <div @click="removeKufurEngelClosed(chn.id)" :class="(hover ? 'red' : 'grey')" class="text-center mt-1 font-weight-black darken-2 col-12">
              {{(hover ? 'Kaldır' : chn.name)}}
            </div>
          </v-hover>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      channels: [],
      kufurEngelOpen: true,
      kufurEngelClosedChannels: [],
      kufurEngelChannel: ""
    }
  },
  async created() {
    let getkufurEngelClosedChannels = await this.$axios.get("/api/kufurEngelClosedChannels");
    this.kufurEngelClosedChannels = getkufurEngelClosedChannels.data.channels;

    let getChannels = await this.$axios.get("/api/channels");
    this.channels = getChannels.data.channels;

    let kufurEngelOpen = await this.$axios.get("/api/kufurEngel");
    this.kufurEngelOpen = kufurEngelOpen.data.open;
  },
  methods: {
    async changeKufurEngel() {
      this.kufurEngelOpen = !this.kufurEngelOpen

      await this.$axios.post("/api/kufurEngel")
    },
    async kufurEngelCloseChannel() {
      this.$axios.post("/api/kufurEngelClosedChannels", {
        channel: this.kufurEngelChannel
      }).then(a => {
        window.location.reload();
      });
    },
    async removeKufurEngelClosed(id) {
      this.$axios.delete("/api/kufurEngelClosedChannels", {
        data: {
          channel: id
        }
      }).then(a => {
        window.location.reload();
      });
    }
  }
}

</script>
