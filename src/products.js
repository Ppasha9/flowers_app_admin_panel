import * as React from "react";
import {
    List,
    SimpleList,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    Edit,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    Create,
    NumberInput,
    SelectArrayInput,
    ImageInput,
    ImageField,
    ArrayField,
    SingleFieldList,
    ChipField,
    SelectField,
    useRecordContext
} from "react-admin";

const MyArrayField = ({ source }) => {
    const record = useRecordContext();
    return record ? (
        <ul>
            {record[source].map(item => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    ) : null;
}

const categories = [
    { _code: "New", name: "Новинки" },
    { _code: "Bouquet", name: "Букеты" },
    { _code: "Basket", name: "Корзинки" },
]

const tags = [
    { _code: "Нежный", name: "Нежный" },
    { _code: "День Рождения", name: "День Рождения" },
    { _code: "Любимой", name: "Любимой" },
    { _code: "Маме", name: "Маме" },
    { _code: "Просто так", name: "Просто так" },
    { _code: "Розовый", name: "Розовый" },
    { _code: "Голубой", name: "Голубой" },
    { _code: "Подруге", name: "Подруге" },
    { _code: "Бесплатная доставка", name: "Бесплатная доставка" },
]

const flowers = [
    { _code: "Розы", name: "Розы" },
    { _code: "Тюльпаны", name: "Тюльпаны" },
    { _code: "Хризантемы", name: "Хризантемы" },
]

export const ProductList = props => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="content" />
                <TextField source="size" />
                <TextField source="height" />
                <TextField source="diameter" />
                <TextField source="price" />
                <MyArrayField source="categories" />
                <MyArrayField source="tags" />
                <MyArrayField source="flowers" />
                <EditButton />
            </Datagrid>
        </List>
    );
};

export const ProductCreate = props => {
    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="name" label="Name" resettable />
                <TextInput source="content" label="What contains" multiline resettable />
                <TextInput source="size" label="Size" />
                <NumberInput source="height" label="Height" />
                <NumberInput source="diameter" label="Diameter" />
                <NumberInput source="price" label="Price" />
                <SelectArrayInput source="categories" choices={categories} optionText="name" optionValue="_code" resettable />
                <SelectArrayInput source="tags" choices={tags} optionText="name" optionValue="_code" resettable />
                <SelectArrayInput source="flowers" choices={flowers} optionText="name" optionValue="_code" resettable />
                <ImageInput source="picture" label="Product picture" placeholder={<p>Drop your file here</p>} >
                    <ImageField source="src" />
                </ImageInput>
            </SimpleForm>
        </Create>
    );
}

export const ProductEdit = props => {
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="name" label="Name" resettable />
                <TextInput source="content" label="What contains" multiline />
                <TextInput source="size" label="Size" />
                <NumberInput source="height" label="Height" />
                <NumberInput source="diameter" label="Diameter" />
                <NumberInput source="price" label="Price" />
                <SelectArrayInput source="categories" choices={categories} optionText="name" optionValue="_code" />
                <SelectArrayInput source="tags" choices={tags} optionText="name" optionValue="_code" />
                <SelectArrayInput source="flowers" choices={flowers} optionText="name" optionValue="_code" />
                <ImageInput disabled source="picture" label="Product picture" placeholder={<p>Drop your file here</p>} >
                    <ImageField source="src" />
                </ImageInput>
            </SimpleForm>
        </Edit>
    );
}