import {Label, LabelModel} from '../models/Label';

class LabelsService {
    getAllLabels() {
        return Label.find({});
    }

    findLabelBy(query: {[key:string]: string}) {
        return Label.findOne(query);
    }

    createLabel(label: LabelModel) {
        return Label.create(label);
    }

    deleteLabel(query: {[key:string]: string}){
        return Label.findOneAndDelete(query);
    }

    updateLabel(id: string, label: LabelModel) {
        return Label.updateOne({_id: id}, label)
    }
}

const labelsService = new LabelsService();

export {
    labelsService
}
