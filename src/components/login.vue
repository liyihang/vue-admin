<template>
  <div class="login-container">
    <div class="login-row">
      <div class="login-logo">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- form -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="ruleForm.username">
            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="ruleForm.password" type="password">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 登录注册按钮 -->
        <el-row>
          <el-col :offset="18">
            <el-link>重置密码</el-link>
          </el-col>
          <el-col :offset="10">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 25, message: '密码长度在 6 到 25 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    login () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.ruleForm)
        if (res.meta.status !== 200) {
          window.sessionStorage.removeItem('token')
          return this.$message.error('登录失败')
        }
        // login success
        this.$message.success('登录成功')
        // store the token in sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        console.log(res)
        // to home page
        this.$router.push('/home')
      })
    }
  }

}
</script>

<style scoped lang="less">
.login-container {
  height: 100%;
  width: 100%;
  background-color: rgb(2, 134, 134);
  overflow: hidden;
}
.login-row {
  height: 400px;
  width: 550px;
  background-color: aliceblue;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
.login-logo {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 1px solid gray;
  padding: 10px;
  position: absolute;
  top: -65px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  box-shadow: 0 0 10px gray;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: white;
  }
}
form.el-form {
  padding-top: 20vh;
}
.el-input {
  width: 85%;
}
.el-col-offset-10 {
  padding-left: 10px;
}
</style>
