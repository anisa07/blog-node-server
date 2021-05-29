import {Label, LabelModel} from '../models/Label';

class LabelService {
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

    // TODO check
    updateLabel(id: string, label: LabelModel) {
        return Label.updateOne({id}, label)
    }
}

const labelService = new LabelService();

export {
    labelService
}
