<!--网站首页详情-->
<template>
  <div class="common-layout">
    <el-container style="min-width: 1200px;">
      <el-header>hea</el-header>
      <el-container style="min-width: 1200px;">
        <el-aside width="200px"></el-aside>
        <el-main><!--最大-->
          <el-container style="height: 100vh;min-width: 1200px;">
            <el-main >
              <el-carousel height="462px" style="width: 520px;">
                <el-carousel-item v-for="item in 3" :key="item">
                  <h3>{{ item }}</h3>
                </el-carousel-item>
              </el-carousel>
            </el-main>
            <el-main>
              <template v-for="row in 2" :key="row">
                <el-row :gutter="20" class="card-row">
                  <el-col v-for="col in 3" :key="col" :span="8" class="card-col">
                    <el-card shadow="hover">Hover</el-card>
                  </el-col>
                </el-row>
              </template>
            </el-main>
          </el-container>
        </el-main>
        <el-aside width="200px"></el-aside>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>
<style scoped>

.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-row {
  margin-bottom: 20px;
}

.el-card {
  width: 250px;
  height: 220px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

::-webkit-scrollbar {
  display: none;
}
</style>