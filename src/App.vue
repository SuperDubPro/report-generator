<template>
  <div id="app">
    <Header> </Header>
    <section id="form-section">
      <Form style="width: 100%;"> </Form>
      <FilesList style="width: 30%; margin-right: 160px"> </FilesList>
    </section>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Form from './components/Form.vue'
import FilesList from "./components/FilesList";

export default {
  name: 'App',
  components: {
    Header,
    Form,
    FilesList
  }
}
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 32px;
  }
  #form-section {
    display: flex;
    flex-direction: row;
  }
  .Form {

  }
  .FilesList {

  }
</style>
