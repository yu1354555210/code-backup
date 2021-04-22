'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate  //聚合操作符
exports.main = async (event, context) => {
	//接受分类, 通过分类去筛选数据
	//event为客户端上传的参数
	// const list = await db.collection('article')
	// 	.field({
	// 		//true 至返回这个字段, false 表示不返回
	// 		content: false
	// 	})
	// 	.get()
	
	const {
		user_id,
		value
	} = event
	
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userinfo.data[0].article_likes_ids
	
	const list = await db.collection('article')
	.aggregate()
	//追加字段
	.addFields({
		is_like: $.in(['$_id', article_likes_ids])
	})
	.project({
		content: 0
	})
	.match({
		title: new RegExp(value)
	})
	.end()

	console.log(list);

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
