<template>
 <div class="loginContainer">
    <div class="formWrapper">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item>
          <div class="loginTitle">智能点餐系统</div>
        </el-form-item>
        <el-form-item prop="user_account">
          <el-input v-model="form.user_account" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="user_password">
          <el-input v-model="form.user_password" placeholder="密码" show-password prefix-icon="el-icon-unlock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="submitForm('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script scoped>
import { login } from '@/api/user'
export default {
    name:'login',
    data() {
      return {
        form: {
          user_account: "",
          user_password: ""
        },
        rules: {
          user_account: [
            { required: true, message: "请输入用户名", trigger: "blur" }
          ],
          user_password: [{ required: true, message: "请输入密码", trigger: "blur" }]
        }
      };
    },
    methods: {
      submitForm( formName ) {
        let params = {
          user_account:this.form.user_account,
          user_password: this.form.user_password
        };

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('user/login', params)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(( error ) => {
              this.form.user_password = ''
              this.$message.error(error);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style >
.loginContainer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../../assets/images/login.png');
  /* background: url('https://www.baidu.com/img/bd_logo1.png') no-repeat; */
  background-size: 100%;
}

.loginTitle {
  color: #fe7e00;
  text-align: center;
  font-size: 23px;
  font-weight: 550;
}
.loginContainer .formWrapper {
  background: rgba(0, 0, 0, 0.3);
  width: 600px;
  display: flex;
  box-sizing: border-box;
  padding: 30px 60px;
}
.loginContainer .el-form {
  width: 100%;
}
.loginContainer .el-input {
  background: transparent;
}
.loginContainer .el-button--warning {
  width: 100%;
}
.loginContainer .el-form-item.is-error .el-input__inner,
.loginContainer .el-form-item.is-error .el-input__inner:focus,
.loginContainer .el-form-item.is-error .el-textarea__inner,
.loginContainer .el-form-item.is-error .el-textarea__inner:focus {
  border: none;
}
.loginContainer .el-input__inner {
  background: transparent;
  border: none;
    color: #fff;
    text-indent: 20px;

}
.loginContainer .el-form-item__error {
    left: 46px;
}
.loginContainer .el-input--prefix::after {
    content: '';
    width: 90%;
    height: 2px;
    background: #fff;
    position: absolute;
    bottom: 0px;
    left: 10%;
}
.loginContainer .el-form-item {
    margin-bottom: 50px;
}
.el-icon-user,
.el-icon-unlock {
  font-size:18px;
}
</style>
