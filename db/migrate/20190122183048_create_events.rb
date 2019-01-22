class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.text   :template,  null: false
      t.text   :data,      null: false
      t.string :status

      t.belongs_to :campaign

      t.timestamps
    end
  end
end
