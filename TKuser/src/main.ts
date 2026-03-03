import "./assets/main.css";
import "./App.vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Dialog from "primevue/dialog";
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.component("Dialog", Dialog);
app.use(ConfirmationService);

app.mount("#app");
