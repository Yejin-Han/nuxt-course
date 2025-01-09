export const useCurrency = (amount) => {
  const currency = computed(() => {
    return new Intl.NumberFormat("ko", {
      style: "currency",
      currency: "KRW",
    }).format(isRef(amount) ? amount.value : amount);
  });

  return { currency };
};
