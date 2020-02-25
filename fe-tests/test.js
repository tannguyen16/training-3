import { Selector } from 'testcafe';

fixture `Student Table`
    .page `http://localhost:3000`;

test('Add an user succeeded will increase the row count of the table by one', async t => {
    const rowCount = await Selector('#student-table tr').count;
    await t
        .typeText('#name-input', 'John Smith')
        .typeText('#grade-input', '55')
        .click('#btn-add')
        .expect(Selector('#student-table tr').count).eql(rowCount + 1);
});

test('Add an user succeeded will leave the last row with new user name', async t => {
    const rowCount = await Selector('#student-table tr').count;
    const newUser = {
        name: 'Tan Nguyen',
        grade: 80
    }
    await t
        .typeText('#name-input', newUser.name)
        .typeText('#grade-input', newUser.grade.toString())
        .click('#btn-add')
        .expect(Selector('#student-table .name-col').nth(rowCount - 2).innerText).eql(newUser.name)
});

test('Add an user succeeded will leave the last row with new user grade', async t => {
    const rowCount = await Selector('#student-table tr').count;
    const newUser = {
        name: 'Jason Nguyen',
        grade: 65
    }
    await t
        .typeText('#name-input', newUser.name)
        .typeText('#grade-input', newUser.grade.toString())
        .click('#btn-add')
        .expect(Selector('#student-table .grade-col').nth(rowCount - 2).innerText).eql(newUser.grade.toString())
});

test('Add an user failed will keep the row count of the table', async t => {
    const rowCount = await Selector('#student-table tr').count;
    await t
        .typeText('#name-input', 'John Smith')
        .typeText('#grade-input', '551')
        .click('#btn-add')
        .expect(Selector('#student-table tr').count).eql(rowCount);
});

test('Delete an user succeeded will decrease the row count of the table by one', async t => {
    const rowCount = await Selector('#student-table tr').count;
    const optionButton = Selector('#student-table .option-btn').nth(2);
    await t
        .hover(optionButton)
        .click('.option:hover .delete-btn')
        .expect(Selector('#student-table tr').count).eql(rowCount - 1);
});

test('Delete an user succeeded will change the row value', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const ogName = await Selector('#student-table .name-col').nth(2).innerText;
    const ogGrade = await Selector('#student-table .grade-col').nth(2).innerText;
    await t
        .hover(optionButton)
        .click('.option:hover .delete-btn')
        .expect(Selector('#student-table .name-col').nth(2).innerText).notEql(ogName)
        .expect(Selector('#student-table .grade-col').nth(2).innerText).notEql(ogGrade);
});

test('Edit an user then cancel will not change the user name to new user name', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const newUser = {
        name: 'Dummy Dummy',
        grade: 12
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .typeText('tbody #name-input', newUser.name)
        .click('#cancel-btn')
        .expect(Selector('#student-table .name-col').nth(2).innerText).notEql(newUser.name)
});

test('Edit an user then cancel will keep the original user name', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const ogName = await Selector('#student-table .name-col').nth(2).innerText;
    const newUser = {
        name: 'Dummy Dummy',
        grade: 12
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .typeText('tbody #name-input', newUser.name)
        .click('#cancel-btn')
        .expect(Selector('#student-table .name-col').nth(2).innerText).eql(ogName)
});

test('Edit an user then cancel will not change the user grade to new user grade', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const newUser = {
        name: 'Dummy Dummy',
        grade: 12
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .typeText('tbody #grade-input', newUser.grade.toString())
        .click('#cancel-btn')
        .expect(Selector('#student-table .grade-col').nth(2).innerText).notEql(newUser.grade.toString());
});


test('Edit an user then cancel will keep the user grade', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const ogGrade = await Selector('#student-table .grade-col').nth(2).innerText;
    const newUser = {
        name: 'Dummy Dummy',
        grade: 12
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .typeText('tbody #grade-input', newUser.grade.toString())
        .click('#cancel-btn')
        .expect(Selector('#student-table .grade-col').nth(2).innerText).eql(ogGrade);
});

test('Edit an user then save will not keep the original user name', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const ogName = await Selector('#student-table .name-col').nth(2).innerText;
    const newUser = {
        name: 'Dummy Dummy',
        grade: 12
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .click('tbody #name-input')
        .pressKey('ctrl+a delete')
        .typeText('tbody #name-input', newUser.name.toString())
        .click('#save-btn')
        .expect(Selector('#student-table .name-col').nth(2).innerText).notEql(ogName);
});

test('Edit an user then save will update the user name', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const newUser = {
        name: 'Dummy Dummy',
        grade: 12
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .click('tbody #name-input')
        .pressKey('ctrl+a delete')
        .typeText('tbody #name-input', newUser.name.toString())
        .click('#save-btn')
        .expect(Selector('#student-table .name-col').nth(2).innerText).eql(newUser.name);
});

test('Edit an user then save will not keep the original user grade', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const ogGrade = await Selector('#student-table .grade-col').nth(2).innerText;
    const newUser = {
        name: 'Dummy Dummy',
        grade: 12
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .click('tbody #grade-input')
        .pressKey('ctrl+a delete')
        .typeText('tbody #grade-input', newUser.grade.toString())
        .click('#save-btn')
        .expect(Selector('#student-table .grade-col').nth(2).innerText).notEql(ogGrade);
});

test('Edit an user then save will update the user grade', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const newUser = {
        name: 'Dummy Dummy',
        grade: 12
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .click('tbody #grade-input')
        .pressKey('ctrl+a delete')
        .typeText('tbody #grade-input', newUser.grade.toString())
        .click('#save-btn')
        .expect(Selector('#student-table .grade-col').nth(2).innerText).eql(newUser.grade.toString());
});

test('Edit an user then enter an invalid grade then save will not update the user grade', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const ogGrade = await Selector('#student-table .grade-col').nth(2).innerText;
    const newUser = {
        name: 'Dummy Dummy',
        grade: 123
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .click('tbody #grade-input')
        .pressKey('ctrl+a delete')
        .typeText('tbody #grade-input', newUser.grade.toString())
        .click('#save-btn')
        .expect(Selector('#student-table .grade-col').nth(2).innerText).notEql(newUser.grade.toString());
});

test('Edit an user then enter an invalid grade then save will keep the original user grade', async t => {
    const optionButton = Selector('#student-table .option-btn').nth(2);
    const ogGrade = await Selector('#student-table .grade-col').nth(2).innerText;
    const newUser = {
        name: 'Dummy Dummy',
        grade: 123
    }
    await t
        .hover(optionButton)
        .click('.option:hover .edit-btn')
        .click('tbody #grade-input')
        .pressKey('ctrl+a delete')
        .typeText('tbody #grade-input', newUser.grade.toString())
        .click('#save-btn')
        .expect(Selector('#student-table .grade-col').nth(2).innerText).notEql(ogGrade);
});