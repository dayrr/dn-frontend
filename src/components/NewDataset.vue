<template>

  <div>
    <h2 class='mt-3 mb-3'> New dataset </h2>
    <b-form @submit.prevent="">

      <b-card header="Dataset" variant="dark">
        <b-card-text>
          <div>
            <b-form-group id="fieldset-1" description="Generated automatically" label="URI" label-for="input-1"
              label-cols-sm="1" label-cols-lg="1">
              <b-form-input id="input-1" v-model="uri" disabled></b-form-input>
            </b-form-group>


            <b-form-group id="fieldset-2" description="" label="Title*" label-for="input-2" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-input id="input-2" v-model="title" placeholder="Dataset title">
              </b-form-input>
            </b-form-group>




            <b-form-group id="fieldset-3" description="" label="Description*" label-for="input-3" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-input id="input-3" v-model="desc" placeholder="Dataset description">
              </b-form-input>
            </b-form-group>

            <b-form-group id="fieldset-7" description="" label="Subject*" label-for="input-7" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-select v-model="subject" :options="options"></b-form-select>
            </b-form-group>

            <b-form-group id="fieldset-4" description="" label="Keyword" label-for="input-4" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-input id="input-4" v-model="keywords" placeholder="Keyword"></b-form-input>
            </b-form-group>


            <b-form-group id="fieldset-5" description="" label="Issued date" label-for="input-5" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-datepicker id="datepicker-dateformat"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" v-model="issuedDate"
                locale="en">
              </b-form-datepicker>
            </b-form-group>




            <b-form-group id="fieldset-6" description="" label="Note" label-for="input-6" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-input id="input-6" v-model="note" placeholder="Note"></b-form-input>
            </b-form-group>



          </div>
        </b-card-text>



      </b-card>


      <b-card header="Creators (Authors)*">
        <button type="button" v-on:click="addAgent('creator')">+</button>

        <Agent v-for="agent in creators" :key="agent.id" :agent="agent" :idxLocal="agent.idxLocal"
          :agentType="agent.agentType" :uri="agent.uri" @updated="updateAgent"></Agent>


      </b-card>

      <b-card header="Publishers (Contacts)*">
        <button type="button" v-on:click="addAgent('publisher')">+</button>
        <Agent v-for="agent in publishers" :key="agent.id" :agent="agent" :idxLocal="agent.idxLocal"
          :agentType="agent.agentType" :uri="agent.uri" @updated="updateAgent"></Agent>
      </b-card>

      <b-card header="Depositors">
        <button type="button" v-on:click="addAgent('depositor')">+</button>
        <Agent v-for="agent in depositors" :key="agent.id" :idxLocal="agent.idxLocal" :agent="agent"
          :agentType="agent.agentType" :uri="agent.uri" @updated="updateAgent"></Agent>
      </b-card>


      <b-card header=" Related publication">
        <button type="button" v-on:click="addPublication()"> + </button>
        <Publication v-for="pub in pubs" v-bind:key="pub"  :dsID="pub.dsID" @updated="updatePub" :num="pub.num" :pub="pub"
          :authors="pub.authors"></Publication>
      </b-card>



      <b-button block class="text-center mt-4 mb-4" type="button" size="lg" @click="submitForm" variant="primary">Create dataset</b-button>


    </b-form>

  </div>
</template>

<script>
  const axios = require('axios');

  export default {
    data() {
      return {
        uri: '',
        id: '',
        title: '',
        desc: '',
        keywords: '',
        pubs: [],
        creators: [],
        authors: [],
        issuedDate: '',
        note: '',
        depositors: [],
        publishers: [],
        count: 0,
        countpb: 0,
        show: true,
        subject: '5',
        options: [{
            value: '1',
            text: 'Arts and Humanities'
          },
          {
            value: '2',
            text: 'Astronomy and Astrophysics'
          },
          {
            value: '3',
            text: 'Business and Management'
          },
          {
            value: '4',
            text: 'Chemistry'
          },
          {
            value: '5',
            text: 'Computer and Information Science'
          },
          {
            value: '6',
            text: 'Earth and Environmental Sciences'
          },
          {
            value: '7',
            text: 'Engineering'
          },
          {
            value: '8',
            text: 'Law'
          },
          {
            value: '9',
            text: 'Mathematical Sciences'
          },
          {
            value: '10',
            text: 'Medicine, Health and Life Sciences'
          },
          {
            value: '11',
            text: 'Physics'
          },
          {
            value: '12',
            text: 'Social Sciences'
          },
          {
            value: '13',
            text: 'Other'
          },
        ]
      }
    },
    created: function () {
      
      this.id = new Date().getTime();
      this.uri = "<http://melodi.irit.fr/resource/Dataset/dn_" + this.id + ">";
      this.creators.push({
        uri: "<http://melodi.irit.fr/resource/Agent/dn_" + this.id + this.count + ">",
        agentType: "Creator",
        name: "",
        email: "",
        idxLocal: this.creators.length + 1,
        idx: this.count
      });

      this.count++;
        this.publishers.push({
        uri: "<http://melodi.irit.fr/resource/Agent/dn_" + this.id + this.count + ">",
        agentType: "Publishers",
        name: "",
        email: "",
        idxLocal: this.publishers.length + 1,
        idx: this.count
      });
      this.count++;
    },
    methods: {
      updateAgent: function (name, email, uri, agent) {


        agent.name = name;
        agent.email = email;
        agent.uri = uri;



      },
      updatePub: function (uri, title, issuedDate, identifier, authors, pub) {
     
        pub.uri = uri;
        pub.title = title;
        pub.authors = authors;
        pub.issuedDate = issuedDate;
        pub.identifier = identifier;


      },

      addPublication: function () {
        this.pubs.push({
          dsID: this.id,
          num: this.countpb,
          uri: '',
          authors: [],
          identifier: '',
          issuedDate: '',
          idxLocal: this.countpb
        });

        this.countpb++;
      },
      addAgent: function (type) {
        if (type === "creator")

          this.creators.push({
            uri: "<http://melodi.irit.fr/resource/Agent/dn_" + this.id + this.count + ">",
            agentType: "Creator",
            name: "",
            email: "",
            idx: this.count,
            idxLocal: this.creators.length + 1
          });
        else if (type === "publisher")
          this.publishers.push({
            uri: "<http://melodi.irit.fr/resource/Agent/dn_" + this.id + this.count + ">",
            agentType: "Publisher",
            name: "",
            email: "",
            idx: this.count,
            idxLocal: this.publishers.length + 1
          });
        else
          this.depositors.push({
            uri: "<http://melodi.irit.fr/resource/Agent/dn_" + this.id + this.count + ">",
            agentType: "Depositor",
            name: "",
            email: "",
            idx: this.count,
            idxLocal: this.depositors.length + 1
          });
        this.count++;
      },
      submitForm() {
        //evt.preventDefault();

        axios({
            method: 'post',
            url: '/dataset',
            data: {
              uri: this.uri,
              title: this.title,
              description: this.desc,
              keywords: this.keywords,
              note: this.note,
              issuedDate: this.issuedDate,
              creators: this.creators,
              publishers: this.publishers,
              depositors: this.depositors,
              pubs: this.pubs,
              subject: this.subject
            }
          }).then((res) => {
           // alert(JSON.stringify(res.data));
          window.open("http://localhost:8085/dataset.xhtml?persistentId="+res.data.result, '_blank');  
          this.$router.push({ name: 'upload-files' , params: { doi: res.data.result, uri:this.uri, id:this.id}});
            
          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>