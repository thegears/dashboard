<template>
  <v-row justify="center" align="center" class="pt-5 ">
    <v-select class="col-12" :items="channels" item-text="name" item-value="id" v-model="selectedChannel" filled label="Kanal"></v-select>
    <v-text-field class="col-12" id="text" label="Yazı" filled></v-text-field>
    <v-btn @click="send" class="col-2" elevation="24" outlined rounded>Gönder</v-btn>
    <v-snackbar v-model="snackbar" timeout="2000" outlined :color="(error ? 'error' : 'success')" absolute>
      {{ (error ? 'Mesajı atamadım' : 'Mesajı attım') }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      channels: [],
      selectedChannel: "",
      snackbar: false,
      error: false
    }
  },
  async created() {
    let getChannels = await this.$axios.get("/api/channels");
    this.channels = getChannels.data.channels;
  },
  methods: {
    async send() {
      let text = document.getElementById("text").value;
      if (!text) return false;
      this.$axios.post("/api/message", {
        channel: this.selectedChannel,
        text
      }).then(req => {
        this.error = false;
        this.snackbar = true;
      }).catch(err => {
        this.error = true;
        this.snackbar = true;
      });
    }
  }
}

</script>
