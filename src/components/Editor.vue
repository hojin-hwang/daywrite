<template>
    <p class="editor" contenteditable="true" ></p>
</template>
  
  <script setup>
  import { reactive, onMounted } from 'vue'
  import { RouterLink,  useLink } from 'vue-router'
  import { marked } from 'marked';

  </script>
  <style>
  
  p.editor{width:100%; border: 1px solid #eee;}
  h1{margin-bottom:12px;}
  p{margin-bottom:12px;}
  pre{padding: 16px;
          overflow: auto;
          font-size: 85%;
          line-height: 1.45;
          color: black;
          background-color: #e0ebf6;
          border-radius: 6px;
  }
  blockquote{
    margin: 16px;
    padding: 0 1em;
    /* color: black; */
    border-left: 0.25em solid #d0d7de;
  }  

  </style>
  