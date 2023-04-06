<template>
  <div class="about">
    <section>
      <div v-for="(paragraph, index) in paragraph_list" :key="index" >
        <p v-if="(paragraph.tag === 'p')" :id="'__'+index" contenteditable="true" @keyup="readText2(index, $event)" @keydown="$event=>readText(index, $event)" class="editor">{{ paragraph.content }}</p>
        <h1 v-else-if="(paragraph.tag === 'h1')" :id="'__'+index" contenteditable="true"  @keyup="readText2(index, $event)" @keydown="$event=>readText(index, $event)" class="editor">{{ paragraph.content }}</h1>
        <blockquote v-else-if="(paragraph.tag === 'blockquote')" :id="'__'+index" contenteditable="true" @keyup="readText2(index, $event)" @keydown="$event=>readText(index, $event)" class="editor">{{ paragraph.content }}</blockquote>
      </div>
    </section>
    
    <article v-html="temp_text.body"></article>
    <!--<textarea rows="5" input="paragraph" @input="$event=>readParagraph($event)">{{paragraph.body}}</textarea> -->
    <button type="button" @click="saveParagraph">SAVE</button>
  </div>
</template>

<script setup>
import { reactive, onMounted , nextTick, onUpdated} from 'vue'
import { marked } from 'marked'

const temp_text = reactive({body:''})

const paragraph_list = reactive([
  {
    tag : 'p',
    content:''
  },
])

const readText = async (index, event)=>
{
  if(event.keyCode === 13) //enter
  {
    //paragraph_list[index].content = event.target.outerText;
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
      //paragraph_list[index].content = event.target.outerText;

      await nextTick();
      document.querySelector(`#__${index}`).focus();
    }
  }
  else //normal
  {
    //paragraph_list[index].content = event.target.outerText;
    const current_tag_name = event.target.tagName.toLowerCase();
    const tag_name = readFirstWord(event.target.innerText.substring(0,10), current_tag_name);
    if(tag_name !== current_tag_name)
    {
      paragraph_list[index].tag = tag_name;
      paragraph_list[index].content = event.target.outerText.substring(1) + '\n';
      await nextTick();
      document.querySelector(`#__${index}`).focus();
    }
  }
}

const readText2 = async (index, event)=>
{
  paragraph_list[index].content = event.target.innerText;
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
  document.querySelector('.editor:last-child').focus()
})

const saveParagraph = ()=>
{
  let text = '';
  paragraph_list.forEach(paragraph=>{
    if(paragraph.tag === 'p')
    {
      text += `${paragraph.content}\n\n`;
    }
    else if(paragraph.tag === 'blockquote')
    {
      text += `> ${paragraph.content}\n\n`;
    }
    else if(paragraph.tag === 'h1')
    {
      text += `# ${paragraph.content}\n`;
    }
  })
  const article_data = {
    archiveNo : `article_${Date.now().toString()}`,
    article : text,
    createDate : util.getNow(),
  }

  localStorage.setItem(article_data.archiveNo, JSON.stringify(article_data));

  temp_text.body = marked.parse((JSON.parse(localStorage.getItem(article_data.archiveNo))).article);
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
  display: block;
  margin: 16px;
  padding: 0 1em;
  border-left: 0.25em solid #d0d7de;
}  
@media (min-width: 1024px) {
  
}
</style>
