const BookService = require("../services/book.service");
const MongoDB = require ("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = (req, res) => {
    res.send({message:"create handler"});
};
exports.findAll = (req, res) => {
    res.send({message:"findAll handler"});
};
exports.findOne = (req, res) => {
    res.send({message:"findOne handler"});
};
exports.update = (req, res) => {
    res.send({message:"update handler"});
};
exports.delete = (req, res) => {
    res.send({message:"delete handler"});
};
exports.deleteAll = (req, res) => {
    res.send({message:"deleteAll handler"});
};
exports.findAllFavorite = (req, res) => {
    res.send({message:"findAllFavorite handler"});
};

exports.create = async (req, res, next) =>{
    if (!req.body?.name){
        return next(new ApiError(400, "Tên sách không được để trống"));
    }

    try{
        const bookservice = new BookService(MongoDB.client);
        const document = await bookservice.create(req.body);
        return res.send(document);    
    } catch (error) {
        return next(
          new ApiError(500, "Đã xảy ra lỗi khi thêm thông tin sách")
        )
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const bookService = new BookService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await bookService.findByName(name);
        } else {
            documents = await bookService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi")
        );
    }

    return res.send(documents);
};
// Tìm  duy nhất với một id
exports.findOne = async (req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Không tìm thấy cuốn sách này"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất sách với id=${req.params.id}`
            )
        );
    }
}
// Cập nhật một sách theo id trong yêu cầu
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Không được để trống dữ liệu cần cập nhật"));
    }
    try{
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Không tìm thấy cuốn sách này"));
        }
        return res.send({ message: "sách đã được cập nhật thành công"});
    }catch (error){
        return next(
            new ApiError(500, `Lỗi khi cập nhật sách với id=${req.params.id}`)
        );
    }
};
// Xóa một sách với id được chỉ định theo yêu cầu
exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Không tìm thấy sách này"));
        }
        return res.send({message: "Xóa sách thành công"});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa sách với id=${req.params.id}`
            )
        );
    }
};
// Tìm tất cả các sách yêu thích của người dùng
exports.findAllFavorite = async (_req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const documents = await bookService.findFavorite();
        return res.send(documents);
    }catch (error){
        return next(
            new ApiError(
                500,
                "Đã xảy ra lỗi khi truy xuất sách yêu thích"
            )
        );
    }
};
// Xóa tất cả sách của người dùng khỏi cơ sở dữ liệu
exports.deleteAll = async (_req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const deletedCount = await bookService.deleteAll();
        return res.send({
            message: `${deletedCount} sách đã được xóa thành công`,
        });
    }catch (error){
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả sách")
        );
    }
};