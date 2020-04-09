const { Base64 } = require('js-base64');
const myEncode = (str, private) => {
  const privateString = private.split('').reverse().map(e => e.charCodeAt()).join('')
  // 加密字符串 = 私钥转 ASCII 逆序排列
  const resString = str.split('').reverse().map(e => e.charCodeAt() + privateString).join('-')
  // 将传入的待加密字符串转为 ASCII 码逆序排列后（数组），（数组内的元素）依次与 加密字符串拼接
  // 执行的结果数组内的元素使用 - 拼接
  const now = Date.now()
  return Base64.encode(`${resString}-${now}`)
  // 最终结果为 base64转换（上述执行结果字符串与当前时间戳用 - 拼接）
}

const myDecode = (str, private) => {
  const decodeArray= Base64.decode(str).split('-');
  // base64 逆转义 密文 并且使用 - 分割
  const time = decodeArray.pop();
  // 取出最后面的时间戳
  // 待解密字符串数组 = 取出时间戳之后的结果（数组）
  const privateString = private.split('').reverse().map(e => e.charCodeAt()).join('')
  // 加密字符串 = 私钥转 ASCII 逆序排列
  const res = decodeArray.map(e => String.fromCharCode(e.split(privateString)[0])).reverse().join("")
  // 待解密字符串数组内元素依次 去掉包含的加密字符串 得到该元素的 ASCII 码 并将其转为对应字符串 ，结果为一个数组
  // 将上述结果数组逆序拼接得到最终明文
  return { res, time }
  // 返回解密后的明文和加密时的时间戳
}

module.exports = {
  myEncode,
  myDecode
}
