<template>
 <b-card title="Publisher">

          <b-card-text>
            <div>
              <b-form-group id="fieldset-31" description="Generated automatically" label="URI" label-for="input-31"
                state="state" label-cols-sm="1" label-cols-lg="1">
                <b-form-input id="input-31" v-model="uri" :state="state" trim
                  placeholder="<http://melodi.irit.fr/resource/Agent/dn_xxxx>" disabled></b-form-input>
              </b-form-group>

              <b-form-group id="fieldset-32" description="" label="Name*" label-for="input-32" state="state"
                label-cols-sm="1" label-cols-lg="1">
                <b-form-input id="input-32" v-model="note" :state="state" trim placeholder="Name"></b-form-input>
              </b-form-group>


              <b-form-group id="fieldset-33" description="" label="Email" label-for="input-33" state="state"
                label-cols-sm="1" label-cols-lg="1">
                <b-form-input id="input-33" v-model="note" :state="state" trim placeholder="Email" type="email">
                </b-form-input>
              </b-form-group>


            </div>
          </b-card-text>
        </b-card>
</template>

<script>
export default {
  name: 'Agent',
  props: {
      id,
      agentType
  }
}
</script>