<template>
  <div class="about">
    <section>
      <div v-for="(paragraph, index) in paragraph_list" :key="index" >
        <p v-if="(paragraph.tag === 'p')" :id="'__'+index" contenteditable="true"  @keydown="$event=>readText(index, $event)" class="editor">{{ paragraph.content }}</p>
        <h1 v-else-if="(paragraph.tag === 'h1')" :id="'__'+index" contenteditable="true"  @keydown="$event=>readText(index, $event)" class="editor">{{ paragraph.content }}</h1>
        <blockquote v-else-if="(paragraph.tag === 'blockquote')" :id="'__'+index" contenteditable="true"  @keydown="$event=>readText(index, $event)" class="editor">{{ paragraph.content }}</blockquote>
      </div>
    </section>
    
    <!-- <article v-html="viewParagraph.body"></article>
    <textarea rows="5" input="paragraph" @input="$event=>readParagraph($event)">{{paragraph.body}}</textarea> -->
    <button type="button" @click="saveParagraph">SAVE</button>
  </div>
</template>

<script setup>
import { reactive, onMounted , nextTick, onUpdated} from 'vue'
import { RouterLink,  useLink } from 'vue-router'
import { marked } from 'marked';

const paragraph_list = reactive([
  {
    tag : 'p',
    content:'kevin'
  },
])

const readText = async (index, event)=>
{
  if(event.keyCode === 13) //enter
  {
    event.preventDefault();
    const new_paragraph = {
      tag : 'p',
      content: ``,
    };
    paragraph_list.splice(index+1, 0, new_paragraph);
    await nextTick();
    document.querySelector(`#__${index+1}`).focus();
  }
  else if(event.keyCode === 8)//return p tag by pressing delete key at first position 
  {
    if(window.getSelection().anchorOffset === 0)
    {
      paragraph_list[index].tag = 'p';
      paragraph_list[index].content = event.target.innerText;

      await nextTick();
      document.querySelector(`#__${index}`).focus();
    }
  }
  else //normal
  {
    paragraph_list[index].content = event.target.innerText;
    const current_tag_name = event.target.tagName.toLowerCase();
    const tag_name = readFirstWord(event.target.innerText.substring(0,10), current_tag_name);

    if(tag_name !== current_tag_name)
    {
      paragraph_list[index].tag = tag_name;
      paragraph_list[index].content = event.target.innerText.substring(1);
      await nextTick();
      document.querySelector(`#__${index}`).focus();
    }
  }
}

//문장의 첫  단어가 마크테그인지 확인
const readFirstWord = (str, current_tag_name) => 
{
  const first_word = str.substring(0,1);
  if(first_word === '#') return 'h1';
  else if(first_word === '>') return 'blockquote';
  else return current_tag_name;
}

onMounted(() => 
{
  const editors = document.querySelectorAll('.editor');
  editors[editors.length-1].focus();
})


const saveParagraph = ()=>
{
  const storageParagraph = {
    id:33,
    body:paragraph.body,
    date:util.getNow(),
  }
  localStorage.setItem(storageParagraph.id, JSON.stringify(storageParagraph))
}

const util = {
  getNow : () =>
  {
      const date = new Date();
      let year 	= date.getFullYear();
      let month 	= date.getMonth() + 1;
      let day 	= date.getDate();
      if(month < 10) {month = "0" + month};
      if(day < 10) {day = "0" + day};
      return year + "-" + month + "-" + day + " " + date.toLocaleTimeString();
  },
  removeHtmlTage : (text) => 
  {
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    return text.replace(htmlRegexG, '');
  },
  
  generateRandomString : (num) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

</script>
<style>
article{
  width: 100%;
  position: relative;
}

.editor{width:100%; outline: none;}
.editor:focus{border-bottom: 1px solid #eee; }
h1{margin-bottom:12px;}

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
@media (min-width: 1024px) {
  
}
</style>
