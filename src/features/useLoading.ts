import { computed, ref } from 'vue';

const loading = ref(false);

export default () => {
  function setLoading(value) {
    console.log('setting loading:');
    loading.value = value;
    console.log(loading.value);
  }

  const isLoading = computed(() => loading.value);

  return { setLoading, isLoading };
};
