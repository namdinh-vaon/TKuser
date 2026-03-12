import "./assets/main.css";
import "./App.vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Dialog from "primevue/dialog";
import ConfirmationService from "primevue/confirmationservice";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});

app.component("Dialog", Dialog);
app.use(ConfirmationService);
app.use(router);

app.mount("#app");
