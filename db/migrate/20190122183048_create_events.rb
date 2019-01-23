class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :subject,   null: false
      t.text   :template,  null: false
      t.text   :data,      null: false
      t.string :status

      t.belongs_to :campaign,   null: false
      t.belongs_to :credential, null: false

      t.timestamps
    end
  end
end
