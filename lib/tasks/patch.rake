namespace :patch do
  task :rails do
    rails_dir = Rails.root.join("vendor", "rails")
    Rails.root.join("patch", "rails").children.each do |patch|
      patch(patch, rails_dir)
    end
  end

  task :gems do
    Rails.root.join("patch", "gems").children.each do |patch_dir|
      patch_dir.children.each do |patch|
        gem_dir = Rails.root.join("vendor", "gems", patch_dir.basename)
        patch(patch, gem_dir)
      end
    end
  end

  task :all => ["gems", "rails"]
end

def patch(patch, dir)
  puts "Applying patch #{patch.basename} to #{dir.basename}"
  sh "patch -N -p 1 -d #{dir} -i #{patch}"
end
