<template>
  <div class="articles">
    <h1>Read Articles</h1>
    <section :id="article.archiveNo" v-for="(article, index) in articleDataList" :key="index">
      <article v-html="article.article"></article>
      <div class="create-date">
        <span>{{ article.createDate }}</span>
      </div>
      <button class="modify-article-btn"> 
        <RouterLink :to="article.path">⚙️</RouterLink> 
      </button>  
      <hr>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted , nextTick, onUpdated, ref} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import WriteView from './WriteView.vue';

const archive_no = useRoute().params.no;

onMounted(()=>{
  if(archive_no)
  {
    document.getElementById(`${archive_no}`).scrollIntoView();
  }
})

const localData = reactive([]);

const articleDataList = computed(()=>
{
  for (let i = 0; i < localStorage.length; i++) 
  {
    if(localStorage.key(i) === 'folder') continue;
    
    const articleData = JSON.parse(localStorage.getItem(localStorage.key(i)));
    articleData.article = marked.parse(articleData.article)
    articleData.path = `/playground/vue-work/write/${articleData.archiveNo}`;
    localData.push(articleData);
  }

  localData.sort((a, b) => {
    if(a.archiveNo < b.archiveNo) return 1;
    if(a.archiveNo === b.archiveNo) return 0;
    if(a.archiveNo > b.archiveNo) return -1;
  });
  return localData;
})


</script>
<style>
article{
  width: 100%;
  position: relative;
}

h1{margin-bottom:12px; font-size: 18px; font-weight: bold;}

pre{padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    color: black;
    background-color: #e0ebf6;
    border-radius: 6px;
}
blockquote{
  display: block;
  margin: 16px;
  padding: 0 1em;
  border-left: 0.25em solid #d0d7de;
}  

hr{
  margin: 12px 0;
  border: 0;
  height: 1px; border-top: 1px solid #3c3c39;
}

.modify-article-btn
{
  background: unset;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
}
.create-date{
  text-align: right;
  color: gray;
  font-size: 12px;
}
@media (min-width: 1024px) {
  
}
</style>
