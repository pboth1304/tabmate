<script setup>
import { tabmate } from "../../dist/tabmate.es.js";
import { onMounted } from "vue";

onMounted(() => {
  const textarea = document.querySelector("#textarea-tab-width");
  tabmate(textarea, {
    tabWidth: 12,
  });

  textarea.value = `- name: Millennium Falcon
  specs:
    - length: 34.75m
    - width: 25.61m
    - hyperdrive: Class 0.5
    - crew: 4
    - armament: Quad laser cannons
  modifications:
    - hidden compartments
    - upgraded shield generators
    - special modifications by Han Solo
`;
});
</script>
<template>
  <textarea id="textarea-tab-width"></textarea>
</template>
<style module>
textarea {
  margin-top: 1rem;
  width: 100%;
  height: 10rem;
  border: 3px solid #3b82f6;
  border-radius: 9px;
  padding: 10px;
  font-family: monospace;
  transition: all 0.2s ease-in-out;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

textarea:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

textarea:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
</style>
