import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useServicesAuthStore = defineStore('servicesAuth', () => {

    const zebraApiKey = ref(localStorage.getItem('zebraApiKey') || '');
    const gapiLoaded = ref(false);
    const gisLoaded = ref(false);
    const googleAuth = ref(false);

    const calendarRdy = computed(() => (gapiLoaded.value && gisLoaded.value && googleAuth.value));
    const zebraRdy = computed(() => (zebraApiKey.value !== ''));

    const auth = computed(() => (calendarRdy.value && zebraRdy.value));

    function setZebraApiKey() {
        console.log('Setting Zebra key', zebraApiKey.value);
        localStorage.setItem('zebraApiKey', zebraApiKey.value);
    }

    function getZebraApiKey() {
        if (typeof window !== 'undefined' && window.localStorage && zebraApiKey.value === '') {
            console.log('Getting Zebra key', localStorage.getItem('zebraApiKey'));
            zebraApiKey.value = localStorage.getItem('zebraApiKey') || '';
        }
        if (zebraApiKey.value === '') {
            console.error('Zebra API key is empty');
            useAlertsStore().addAlert({ title: 'Zebra API key is empty', message: 'Please set the Zebra API key in the settings', type: 'error' });
        }
        return zebraApiKey.value;
    }

    return {
        setZebraApiKey,
        getZebraApiKey,
        auth,
        gapiLoaded,
        gisLoaded,
        googleAuth,
        calendarRdy,
        zebraRdy,
        zebraApiKey
    };
});
