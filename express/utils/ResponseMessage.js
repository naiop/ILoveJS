const response = { 
    code: 0,
    data: [],
    extra: '',
    message: ''
   }
class ResponseMessage{
    //constructor方法，类的构造方法，实例化这个类就调用这个方法，this代表实例的对象。
    //constructor 类似与 ResponseMessage的无参构造函数
    // constructor() {
    //     this.code= 0;
    //     this.data= [];
    //     this.extra= null;
    //     this.message= null;
    // }
    // //等同于
    // constructor() {
    // }

    undo(){
        response.code =0
        response.data = []
        response.extra = ''
        response.message = ''
    }

    //let _ResponseMessage = new ResponseMessage()
    //let a = _ResponseMessage.Success(2,{items: null , count: 20 }, 'extra','message' )
    Success(code = 20000, data = null, extra = '',message =''){
        try {
            this.undo()
            response.code = code
            response.data = data;
            response.extra = extra;
            response.message = message; 
            return response
        } catch (error) {
            this.undo()
            response.message = error.message; 
            return response
        }

    }
    Fail(code = 20000, data = null, extra = '',message =''){
        try {
            this.undo()
            response.code = code
            response.data = data;
            response.extra = extra;
            response.message = message; 
            return response
        } catch (error) {
            this.undo()
            response.message = error.message; 
            return response
        }
    }
}

module.exports = { ResponseMessage };