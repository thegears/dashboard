<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card elevation="24">
        <v-card-title class="headline text-center">
          <div>Discord bot dashboard'ina hoşgeldin</div>
        </v-card-title>
        <v-card-text>
          <p v-if="token.tokenLogin" class="green--text text--darken-1">Bot giriş yaptı.</p>
          <p v-else>Bot giriş yapmadı. Lütfen sayfayı yenileyin.</p>
          <p v-if="token.tokenError" class="red--text text--darken-1">Token hatalı lütfen kontrol edin.</p>
          <p v-if="token.token != ''">Şu andaki ayarlı token: {{token.token}}</p>
          <p v-else>Ayarlı bir token bulunmamaktadır.</p>
          <div class="d-flex flex-wrap items-center">
            <div class="col-12 text-center">
              <p class="font-weight-black">Token ayarla</p>
            </div>
            <div class="col-12 d-flex justify-space-around">
              <v-text-field id="token" label="Token" filled></v-text-field>
            </div>
            <div class="d-flex col-12 justify-center">
              <v-btn @click="setToken" class="col-2" elevation="24" outlined rounded>Ayarla</v-btn>
            </div>
          </div>
          <v-divider class="mt-2 mb-2" />
          <p v-if="guild != ''">Şu andaki ayarlı sunucu: {{guild.name}}</p>
          <p v-else>Ayarlı bir sunucu bulunmamaktadır.</p>
          <div class="d-flex flex-wrap items-center">
            <div class="col-12 text-center">
              <p class="font-weight-black">Sunucu ayarla</p>
              <p>Lütfen botun tam yetkili olduğu bir sunucu secin.</p>
            </div>
            <div class="col-12 d-flex justify-space-around">
              <v-select :items="guilds" item-text="name" item-value="id" v-model="selectedGuild" filled label="Sunucu"></v-select>
            </div>
            <div class="d-flex col-12 justify-center">
              <v-btn @click="setGuild" class="col-2" elevation="24" outlined rounded>Ayarla</v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      token: "",
      guild: "",
      selectedGuild: "",
      guilds: []
    }
  },
  async created() {
    let getToken = await this.$axios.get("/api/token");
    this.token = getToken.data;

    if (getToken.data.tokenLogin) {
      let getGuilds = await this.$axios.get("/api/guilds");
      this.guilds = getGuilds.data.guilds;
      console.log(getGuilds.data.guilds)

      let getGuild = await this.$axios.get("/api/guild");
      this.guild = getGuild.data.guild;
    };
  },
  methods: {
    async setToken() {
      let token = document.getElementById("token").value;
      if (!token) return false;
      await this.$axios.post("/api/token", {
        token
      });

      window.location.href = "/";
    },
    async setGuild() {
      await this.$axios.post("/api/guild", {
        guild: this.selectedGuild
      });

      window.location.href = "/";
    }
  }
}

</script>
