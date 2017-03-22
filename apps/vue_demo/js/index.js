/**
 * 全局组建
 * 使用(注意，在声明vue对象自之前定义组建)
 * 第一个参数为组建名字
 * 第二个参数为组建参数配置
 * props： 属性，用于数据交互
 * template： 字符串模板，里面的数据可以通过props获取
 */
Vue.component('file-tree-content', {
    props: ['children'],
    template: '<ul>\
                    <li v-for="child in children">\
                        <file-tree v-if="child.children" :folder="child"></file-tree>\
                        <span class="border red" v-else>{{child.name}}</span>\
                    </li>\
                </ul>'
});
Vue.component('file-tree', {
    props: ['folder'],
    template: '<section>\
                    <p>{{folder.name}}</p>\
                    <file-tree-content :children="folder.children"></file-tree-content>\
                </section>'
});

// Vue实例
var main = new Vue({
    // Vue实例的根节点（必需），可以用css选择器
    el: '#Main',
    // 数据
    data: {
        numberStr: '12',
        number: 12,
        message: '你好，我是消息',
        title: '<b>你好</b>',
        show: true,
        lists: [{
            name: 'list1'
        }, {
            name: 'list2'
        }],
        styleObj: {
            color: '#f00',
            'letter-spacing': '2px'
        },
        btns: [{
            text: 'red',
            color: '#0f0'
        }, {
            text: 'green',
            color: '#f00'
        }],
        firstname: 'hangyang',
        lastname: 'ws',
        color: {
            red: false,
            green: true
        },
        colorList: ['red', 'green'],
        colorList2: ['pink'],
        myClassObj: {
            pink: true
        },
        checkbox: '请选择上边的checkbox',
        radio: '请选择上边的radio',
        nowComponent: 'app',
        folder: {
            name: 'folder文件目录',
            children: [{
                name: '图片',
                children: [{
                    name: 'other.jpg'
                }, {
                    name: '风景',
                    children: [{
                        name: 'view.png'
                    }]
                }]
            }]
        }
    },
    /**
     * [computed description]
     * @type {Object}
     * 计算属性（相当于data里面的key，并且数据保持同步）
     * 计算属性是基于它的依赖缓存。计算属性只有在它的相关依赖发生改变时才会重新取值
     */
    computed: {
        // 这种就是getter（默认）,没有setter
        spaceTitle: function() {
            return this.title.split('').join(' ');
        },
        // getter和setter都有
        fullname: {
            get: function() {
                return this.firstname + ' ' + this.lastname;
            },
            set: function(fullname) {
                fullname = fullname.split(/\s+/);
                this.firstname = fullname[0];
                this.lastname = fullname[1];
            }
        },
        myClassObj2: function() {
            return {
                red: !this.color.red,
                green: !this.color.green
            };
        }
    },
    /**
     * [methods description]
     * @type {Object}
     * 方法：用于事件调用
     * 方法里面的this指向当前Vue的实例
     */
    methods: {
        toggleShow: function(e) {
            this.show = !this.show;
            // 方法里面的e（事件参数）等于window.event，即：winodw.event === e
            console.log(this, e);
        },
        log: function(str) {
            console.log(str);
        },
        setName: function(fullname) {
            this.fullname = fullname;
        },
        toggleComponent: function() {
            this.nowComponent = this.nowComponent === 'app' ? 'app2' : 'app';
        }
    },
    /**
     * [watch description]
     * @type {Object}
     * 可以监听数据的改变
     * key为数据的属性名
     */
    watch: {
        show: function(newValue, oldValue) {
            console.log('可见从', oldValue, '变成', newValue);
        }
    },
    // 局部组建，只在当前节点有效
    components: {
        btns: {
            props: ['mybtn'],
            template: '<button v-on:click="$emit(\'myevent\')">{{mybtn.text}} <span class="border red" v-on:click="$emit(\'remove\')">删x除</span></button>'
        },
        'my-component': {
            // props里面的key和data里面的是一样的，相当于注入了数据在data里面
            props: {
                // 对象属性名
                number: {
                    type: Number,
                    required: true,
                    validator: function(v) {
                        return v > 0
                    }
                }
            },
            template: '<p>{{number}}->{{dataNum}}->{{computedNum}}<span class="border red" @click="addNum">addNum</span></p>',
            data: function() {
                return {
                    dataNum: 'data:' + this.number
                };
            },
            methods: {
                addNum: function() {
                    // 方法里面不能改变props的值，只能改变data里面的值
                    this.dataNum += 1;
                }
            },
            computed: {
                computedNum: function() {
                    return 'computed:' + this.dataNum;
                }
            }
        },
        app: {
            template: '<section>\
                        <header>\
                            <slot name="header">默认header</slot>\
                        </header>\
                        <slot title="我是匿名插槽"></slot>\
                        <footer>\
                            <slot name="footer">默认footer</slot>\
                        </footer>\
                    </section>'
        },
        app2: {
            template: '<p>app2</p>'
        }
    },
    created: function() {
        // 实例生命周期，created在实例创建走后调用
        // 也有一些其它的钩子，在实例生命周期的不同阶段调用，如 mounted、 updated 、destroyed 。
        console.log('实例生命周期=>实例创建完成', '详情见图片：http://cn.vuejs.org/images/lifecycle.png (从上到下，红色方框)');
    }
});

/**
 * 属性与方法
 */
// 除了 data 属性， Vue 实例暴露了一些有用的实例属性与方法。这些属性与方法都有前缀 $，以便与代理的 data 属性区分
// main.$data === dat // -> true
// main.$el === document.getElementById('example') // -> true
// $watch 是一个实例方法
// main.$watch('a', function(newVal, oldVal) {
//     // 这个回调将在 `main.a`  改变后调用
// })

/**
 * 关于箭头函数
 */
// 不要在实例属性或者回调函数中（如 main.$watch('show', newVal => console.log(this.show))）使用箭头函数。因为箭头函数绑定父上下文，所以 this 不会像预想的一样是 Vue 实例，而是 this.show 未被定义。
