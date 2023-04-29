const TodoService = require("../services/todo.service");
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
        return next(new ApiError(400, "Tên không được để trống"));
    }

    try{
        const todoservice = new TodoService(MongoDB.client);
        const document = await todoservice.create(req.body);
        return res.send(document);    
    } catch (error) {
        return next(
          new ApiError(500, "Đã xảy ra lỗi khi thêm thông tin công việc")
        )
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const todoService = new TodoService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await todoService.findByName(name);
        } else {
            documents = await todoService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi thêm thông tin công việc")
        );
    }

    return res.send(documents);
};
// Tìm liên hệ duy nhất với một id
exports.findOne = async (req, res, next) => {
    try{
        const todoService = new TodoService(MongoDB.client);
        const document = await todoService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Không tìm thấy công việc này"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất công việc với id=${req.params.id}`
            )
        );
    }
}
// Cập nhật một công việc theo id trong yêu cầu
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Không được để trống dữ liệu cần cập nhật"));
    }
    try{
        const todoService = new TodoService(MongoDB.client);
        const document = await todoService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Không tìm thấy công việc này"));
        }
        return res.send({ message: "công việc đã được cập nhật thành công"});
    }catch (error){
        return next(
            new ApiError(500, `Lỗi khi cập nhật công việc với id=${req.params.id}`)
        );
    }
};
// Xóa một công việc với id được chỉ định theo yêu cầu
exports.delete = async (req, res, next) => {
    try {
        const todoService = new TodoService(MongoDB.client);
        const document = await todoService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Không tìm thấy công việc này"));
        }
        return res.send({message: "Xóa công việc thành công"});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa công việc với id=${req.params.id}`
            )
        );
    }
};
// Tìm tất cả các công việc yêu thích của người dùng
exports.findAllFavorite = async (_req, res, next) => {
    try{
        const todoService = new TodoService(MongoDB.client);
        const documents = await todoService.findFavorite();
        return res.send(documents);
    }catch (error){
        return next(
            new ApiError(
                500,
                "Đã xảy ra lỗi khi truy xuất công việc yêu thích"
            )
        );
    }
};
// Xóa tất cả công việc của người dùng khỏi cơ sở dữ liệu
exports.deleteAll = async (_req, res, next) => {
    try {
        const todoService = new TodoService(MongoDB.client);
        const deletedCount = await todoService.deleteAll();
        return res.send({
            message: `${deletedCount} công việc đã được xóa thành công`,
        });
    }catch (error){
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả công việc")
        );
    }
};